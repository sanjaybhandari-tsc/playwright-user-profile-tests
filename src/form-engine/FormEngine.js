const { classify } = require("../utils/dataClassifier");

class FormEngine {
  constructor(page, ctx) {
    this.page = page;
    this.ctx = ctx;
    this.fields = {};
  }

  registerFields(fields) {
    this.fields = { ...this.fields, ...fields };
  }

  locator(selector) {
    return this.page.locator(selector);
  }

  async fill(fieldKey, value) {
    const field = this.fields[fieldKey];
    if (!field) {
      throw new Error(
        `Field "${fieldKey}" is not registered. Did you call registerFields()?`
      );
    }

    const { selector, group } = field;

    try {
      const isProvided = value !== undefined && value !== null && value !== "";
      let effectiveValue;

      if (!isProvided) {
        effectiveValue = await this.page.locator(selector).inputValue();
        this.ctx.fallback[fieldKey] = effectiveValue;
      } else {
        await this.page.locator(selector).fill(String(value));
        effectiveValue = value;
      }

      this.ctx.setInput(group, fieldKey, effectiveValue);
      this.ctx.setFinal(fieldKey, effectiveValue);
      this.ctx.setGenerated(fieldKey, classify(effectiveValue, isProvided));

    } catch (err) {
      this.ctx.log(`fill [${fieldKey}]: ${err.message}`, "error");
      throw new Error(`fill "${fieldKey}" failed: ${err.message}`);
    }
  }

  async click(selector) {
    try {
      await this.page.locator(selector).click();
    } catch (err) {
      throw new Error(`click "${selector}" failed: ${err.message}`);
    }
  }

  async type(selector, value) {
    if (!value) return;
    try {
      const input = this.page.locator(selector);
      await input.fill("");
      await input.type(value);
    } catch (err) {
      throw new Error(`type "${selector}" failed: ${err.message}`);
    }
  }

  async press(key) {
    try {
      await this.page.keyboard.press(key);
    } catch (err) {
      throw new Error(`press "${key}" failed: ${err.message}`);
    }
  }

  async select(selector, value) {
    try {
      await this.page.locator(selector).click();
      const dropdown = this.page.locator(
        '[role="listbox"], .ant-select-dropdown'
      );
      await dropdown.waitFor({ state: "visible", timeout: 5000 });
      await this.page
        .locator('[role="option"]')
        .filter({ hasText: value })
        .first()
        .click();
    } catch (err) {
      throw new Error(`select "${selector}" → "${value}" failed: ${err.message}`);
    }
  }

  async pause(ms = 500) {
    await this.page.waitForTimeout(ms);
  }

  async captureToast() {
    try {
      const toast = this.page.locator(
        ".ant-message-notice-content, .ant-notification-notice-message"
      );
      const count = await toast.count();

      for (let i = 0; i < count; i++) {
        const message = (await toast.nth(i).innerText()).trim();
        if (!message) continue;

        // ← deduplicate: don't add same message twice
        const already = this.ctx.toasts.some((t) => t.message === message);
        if (!already) {
          this.ctx.addToast({ message });
          this.ctx.log(`Toast captured: "${message}"`, "info");
        }
      }

    } catch (err) {
      this.ctx.log(`captureToast failed: ${err.message}`, "warn");
      // ← don't re-throw — toast capture is best-effort, shouldn't fail the test
    }
  }

  async captureFieldErrors() {
    try {
      const errors = this.page.locator(".ant-form-item-explain-error"); // ← was this.form.page (bug)
      const count = await errors.count();

      for (let i = 0; i < count; i++) {
        const msg = (await errors.nth(i).innerText()).trim();
        if (!msg) continue;

        const fieldContainer = errors
          .nth(i)
          .locator('xpath=ancestor::div[contains(@class,"ant-form-item")]');

        const label = await fieldContainer
          .locator("label")
          .first()
          .innerText()
          .catch(() => "unknown");

        // ← deduplicate: don't add same field+message twice
        const already = this.ctx.fieldErrors.some(
          (e) => e.field === label && e.message === msg
        );
        if (!already) {
          this.ctx.addFieldError({ field: label, message: msg });
        }
      }

      this.ctx.log(
        `captureFieldErrors: found ${count} error(s)`,
        count ? "warn" : "info"
      );

    } catch (err) {
      this.ctx.log(`captureFieldErrors failed: ${err.message}`, "warn");
      // ← don't re-throw — error capture is best-effort
    }
  }
}

module.exports = { FormEngine };