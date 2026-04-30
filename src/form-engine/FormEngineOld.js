const { classify } = require("../utils/dataClassifier");
class FormEngine {
  // constructor(page) {
  //   this.page = page;
  // }
  constructor(page, ctx) {
    this.page = page;
    this.ctx = ctx;
    this.fields = {};
    // this.audit = context.audit;
  }
  registerFields(fields) {
    this.fields = { ...this.fields, ...fields }; //  merge
  }

  locator(selector) {
    return this.page.locator(selector);
  }

  async fill(fieldKey, value) {
    // console.log(" fieldKey:", fieldKey);
    // console.log(" this.fields:", this.fields);
    const field = this.fields[fieldKey];
    if (!field) {
      throw new Error(
        `Field "${fieldKey}" is not registered. Did you call registerFields()?`,
      );
    }
    const { selector, group } = field;

    const isProvided = value !== undefined && value !== null && value !== "";
    let effectiveValue;
    if (!isProvided) {
      effectiveValue = await this.page.locator(selector).inputValue();
      this.ctx.fallback[fieldKey] = effectiveValue;
    } else {
      await this.page.locator(selector).fill(value);
      effectiveValue = value;
    }
    // this.ctx.setInput({ group, key: fieldKey, value: effectiveValue });
    this.ctx.setInput(group, fieldKey, effectiveValue);
    this.ctx.setFinal(fieldKey, effectiveValue);
    // this.ctx.generated[fieldKey] = classify(effectiveValue, isProvided);
    this.ctx.setGenerated(fieldKey, classify(effectiveValue, isProvided));
  }

  async click(selector) {
    await this.page.locator(selector).click();
  }

  async type(selector, value) {
    if (!value) return;
    const input = this.page.locator(selector);
    await input.fill("");
    await input.type(value);
  }

  async press(key) {
    await this.page.keyboard.press(key);
  }

  async select(selector, value) {
    await this.page.locator(selector).click();
    const dropdown = this.page.locator(
      '[role="listbox"], .ant-select-dropdown',
    );
    await dropdown.waitFor({ state: "visible", timeout: 5000 });
    await this.page
      .locator('[role="option"]')
      .filter({ hasText: value })
      .first()
      .click();
  }
  //   async select(selector, value) {
  //   await this.page.locator(selector).click();

  //   // Scope the dropdown to the triggered element's context
  //   const dropdown = this.page.locator('[role="listbox"]:visible, .ant-select-dropdown:visible').last();
  //   await dropdown.waitFor({ state: "visible", timeout: 5000 });

  //   await dropdown
  //     .locator('[role="option"]')
  //     .filter({ hasText: value })
  //     .first()
  //     .click();
  // }

  async pause(ms = 500) {
    await this.page.waitForTimeout(ms);
  }

  async captureToast() {
    const toast = this.page.locator(
      ".ant-message-notice-content, .ant-notification-notice-message",
    );
    const count = await toast.count();

    for (let i = 0; i < count; i++) {
      const message = (await toast.nth(i).innerText()).trim();
      if (message) {
        this.ctx.addToast({ message, time: new Date().toISOString() });
        this.ctx.log(`Toast captured: "${message}"`, "info");
      }
    }
  }

  async captureFieldErrors() {
    const errors = this.form.page.locator(".ant-form-item-explain-error");
    const count = await errors.count();

    for (let i = 0; i < count; i++) {
      const msg = (await errors.nth(i).innerText()).trim();

      const fieldContainer = errors
        .nth(i)
        .locator('xpath=ancestor::div[contains(@class,"ant-form-item")]');

      const label = await fieldContainer
        .locator("label")
        .first()
        .innerText()
        .catch(() => "unknown");

      this.ctx.addFieldError({ field: label, message: msg }); // ← fix was here
    }

    this.ctx.log(
      `captureFieldErrors: found ${count} error(s)`,
      count ? "warn" : "info",
    );
  }
}

module.exports = { FormEngine };
