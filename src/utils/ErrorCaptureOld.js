// // src/utils/ErrorCapture.js

// class ErrorCapture {
//   constructor(page, ctx) {
//     this.page = page;
//     this.ctx = ctx;
//   }

//   // ── Capture toast errors ───────────────────────────────────
//   async captureToasts() {
//     const toasts = this.page.locator(".custom_toast_css");
//     const count = await toasts.count();

//     for (let i = 0; i < count; i++) {
//       const message = (await toasts.nth(i).innerText()).trim();
//       this.ctx.addToast({ message, type: "error" });
//       this.ctx.log(` Toast: "${message}"`, "error");
//     }

//     return count;
//   }

//   // ── Capture field validation errors ───────────────────────
//   async captureFieldErrors() {
//     const errors = this.page.locator(".ant-form-item-explain-error");
//     const count = await errors.count();

//     for (let i = 0; i < count; i++) {
//       const errorEl = errors.nth(i);
//       const message = (await errorEl.innerText()).trim();

//       // climb up to find the help div id e.g. employeeForm_first_name_help
//       const helpDiv = errorEl.locator(
//         'xpath=ancestor::div[contains(@id,"_help")]',
//       );

//       let fieldId = null;
//       if ((await helpDiv.count()) > 0) {
//         const id = await helpDiv.first().getAttribute("id");
//         // "employeeForm_first_name_help" → "first_name"
//         fieldId = id?.replace("employeeForm_", "").replace("_help", "") || null;
//       }

//       this.ctx.addFieldError({ field: fieldId, message });
//       this.ctx.log(` Field error on "${fieldId}": "${message}"`, "error");
//     }

//     return count;
//   }

//   async assertNoErrors(expect, stepName = "") {
//     await this.page.waitForTimeout(300);

//     //fresh errors
//     const freshToasts = [];
//     const freshFieldErrors = [];

//     //toasts
//     const toastEls = this.page.locator(".custom_toast_css");
//     const toastCount = await toastEls.count();
//     for (let i = 0; i < toastCount; i++) {
//       const message = (await toastEls.nth(i).innerText()).trim();
//       freshToasts.push(message);
//       this.ctx.addToast({ message, type: "error" });
//       this.ctx.log(` Toast: "${message}"`, "error");
//     }

//     // field errors
//     const errorEls = this.page.locator(".ant-form-item-explain-error");
//     const fieldErrCount = await errorEls.count();
//     for (let i = 0; i < fieldErrCount; i++) {
//       const errorEl = errorEls.nth(i);
//       const message = (await errorEl.innerText()).trim();

//       const helpDiv = errorEl.locator(
//         'xpath=ancestor::div[contains(@id,"_help")]',
//       );
//       let fieldId = null;
//       if ((await helpDiv.count()) > 0) {
//         const id = await helpDiv.first().getAttribute("id");
//         fieldId = id?.replace("employeeForm_", "").replace("_help", "") || null;
//       }

//       freshFieldErrors.push({ field: fieldId, message });
//       this.ctx.addFieldError({ field: fieldId, message });
//       this.ctx.log(` Field error on "${fieldId}": "${message}"`, "error");
//     }

//     // ── HARD fail on fresh toasts only
//     for (const message of freshToasts) {
//       expect(message, `[${stepName}] Error toast: "${message}"`).toBeFalsy();
//     }

//     // ── HARD fail on fresh field errors only
//     for (const err of freshFieldErrors) {
//       expect(
//         err.message,
//         `[${stepName}] Field "${err.field}" error: "${err.message}"`,
//       ).toBeFalsy();
//     }

//     return { toastCount, fieldErrCount };
//   }
// }

// module.exports = { ErrorCapture };

// utils/ErrorCapture.js

class ErrorCapture {
  constructor(page, ctx) {
    this.page = page;
    this.ctx = ctx;
  }

  async assertNoErrors(expect, stepLabel) {
    // 1. capture toasts first
    await this._captureToasts();

    // 2. capture field-level validation errors
    await this._captureFieldErrors();

    // 3. build failure message if anything was found
    const lines = [];

    const errorToasts = this.ctx.toasts
      .filter(t => this._isErrorToast(t.message))
      .map(t => `  Toast: "${t.message}"`);

    const fieldErrors = this.ctx.fieldErrors
      .map(e => `  Field "${e.field}": "${e.message}"`);

    if (errorToasts.length) lines.push(...errorToasts);
    if (fieldErrors.length) lines.push(...fieldErrors);

    if (lines.length) {
      throw new Error(
        `[${stepLabel}] UI errors detected:\n${lines.join("\n")}`
      );
    }
  }

  async _captureToasts() {
    const selectors = [
      ".ant-message-notice-content",
      ".ant-notification-notice-message",
      ".ant-message-error",
    ];

    for (const sel of selectors) {
      const els = this.page.locator(sel);
      const count = await els.count();
      for (let i = 0; i < count; i++) {
        const message = (await els.nth(i).innerText()).trim();
        if (message) {
          // avoid duplicates
          const already = this.ctx.toasts.some(t => t.message === message);
          if (!already) {
            this.ctx.addToast({ message });
            this.ctx.log(`Toast: "${message}"`, "warn");
          }
        }
      }
    }
  }

  async _captureFieldErrors() {
    const errors = this.page.locator(".ant-form-item-explain-error");
    const count = await errors.count();

    for (let i = 0; i < count; i++) {
      const message = (await errors.nth(i).innerText()).trim();
      if (!message) continue;

      const fieldContainer = errors
        .nth(i)
        .locator('xpath=ancestor::div[contains(@class,"ant-form-item")]');

      const field = await fieldContainer
        .locator("label")
        .first()
        .innerText()
        .catch(() => "unknown");

      // avoid duplicates
      const already = this.ctx.fieldErrors.some(
        e => e.field === field && e.message === message
      );
      if (!already) {
        this.ctx.addFieldError({ field, message });
        this.ctx.log(`Field error — "${field}": "${message}"`, "warn");
      }
    }
  }

  _isErrorToast(message) {
    // filter out success toasts — only flag errors/warnings
    const errorKeywords = ["error", "failed", "invalid", "required", "wrong", "could not"];
    return errorKeywords.some(k => message.toLowerCase().includes(k));
  }
}

module.exports = { ErrorCapture };