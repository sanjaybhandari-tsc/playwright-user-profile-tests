// src/utils/ErrorCapture.js

class ErrorCapture {
  constructor(page, ctx) {
    this.page = page;
    this.ctx  = ctx;
  }

  // ─────────────────────────────────────────────────────────────
  // assertNoErrors — call at end of each step's "assert no UI errors"
  // ─────────────────────────────────────────────────────────────
  // Only reports errors that appeared DURING this step (delta-based).
  // Pushes to ctx for Allure/report, then throws one descriptive error.
  // Other steps and other user tests are NOT affected.

  async assertNoErrors(expect, stepLabel = "?") {
    await this.page.waitForTimeout(300); // let React flush validation state

    const toastsBefore    = this.ctx.toasts.length;
    const fieldErrsBefore = this.ctx.fieldErrors.length;

    await this._captureErrorToasts(stepLabel);
    await this._captureFieldErrors(stepLabel);

    const newToasts    = this.ctx.toasts.slice(toastsBefore);
    const newFieldErrs = this.ctx.fieldErrors.slice(fieldErrsBefore);

    if (newToasts.length === 0 && newFieldErrs.length === 0) return;

    const lines = [`[${stepLabel}] UI errors detected:`];
    newToasts.forEach(t    => lines.push(`  Toast: "${t.message}"`));
    newFieldErrs.forEach(e => lines.push(`  Field "${e.field}": "${e.message}"`));

    throw new Error(lines.join("\n"));
  }

  // ─────────────────────────────────────────────────────────────
  // waitForSuccessToast — call after submit + modal confirm
  // ─────────────────────────────────────────────────────────────
  // Polls every 400ms until timeout.
  //   • .custom_toast_css (red) appears     → capture + hard fail IMMEDIATELY
  //   • .custom_toast_css_success with correct text → sets ctx + returns msg
  //   • .custom_toast_css_success with wrong text   → hard fail
  //   • timeout expires                             → hard fail

  async waitForSuccessToast(timeout = 15_000) {
    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
      // Fast-fail: error toast appeared
      const errToast = this.page.locator(".custom_toast_css");
      if (await errToast.count() > 0) {
        const msg = (await errToast.first().innerText()).trim();
        this.ctx.addToast({ message: msg, type: "error" });
        this.ctx.log(`Submit error toast: "${msg}"`, "error");
        throw new Error(`Submit failed — error toast: "${msg}"`);
      }

      // Success path
      const okToast = this.page.locator(".custom_toast_css_success");
      if (await okToast.count() > 0) {
        const msg = (await okToast.first().innerText()).trim();

        if (msg.includes("Employee profile created successfully")) {
          this.ctx.setGenerated("successToast", msg);
          this.ctx.log(`Success toast confirmed: "${msg}"`, "info");
          return msg;
        }

        // Success-styled but wrong text
        this.ctx.addToast({ message: msg, type: "warning" });
        throw new Error(`Unexpected toast after submit: "${msg}"`);
      }

      await this.page.waitForTimeout(400);
    }

    // Timed out
    await this._captureErrorToasts("Submit");
    const captured = this.ctx.toasts.map(t => `"${t.message}"`).join(", ");
    throw new Error(
      `Success toast never appeared within ${timeout}ms.` +
      (captured ? ` Error toasts: ${captured}` : " No toasts visible.")
    );
  }

  // ─────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────

  async _captureErrorToasts(stepLabel) {
    const els   = this.page.locator(".custom_toast_css");  // red error variant
    const count = await els.count();

    for (let i = 0; i < count; i++) {
      const message = (await els.nth(i).innerText()).trim();
      if (!message) continue;
      if (this.ctx.toasts.some(t => t.message === message)) continue; // dedupe

      this.ctx.addToast({ message, type: "error" });
      this.ctx.log(`[${stepLabel}] Error toast: "${message}"`, "error");
    }
  }

  async _captureFieldErrors(stepLabel) {
    const els   = this.page.locator(".ant-form-item-explain-error");
    const count = await els.count();

    for (let i = 0; i < count; i++) {
      const el      = els.nth(i);
      const message = (await el.innerText()).trim();
      if (!message) continue;

      // Walk up to the help div — its id encodes the field name
      // e.g. id="employeeForm_first_name_help" → field = "first_name"
      const helpDiv = el.locator('xpath=ancestor::div[contains(@id,"_help")]');
      let field = "unknown";
      if (await helpDiv.count() > 0) {
        const id = await helpDiv.first().getAttribute("id");
        field = id?.replace("employeeForm_", "").replace("_help", "") ?? "unknown";
      }

      if (this.ctx.fieldErrors.some(e => e.field === field && e.message === message)) continue; // dedupe

      this.ctx.addFieldError({ field, message });
      this.ctx.log(`[${stepLabel}] Field error — "${field}": "${message}"`, "error");
    }
  }
}

module.exports = { ErrorCapture };