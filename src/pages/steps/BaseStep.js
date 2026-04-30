// pages/steps/BaseStep.js

class BaseStep {
  constructor(form, readModel, ctx) {
    this.form = form;
    this.readModel = readModel;
    this.ctx = ctx;
    this.fields = {};
  }

  // ── Dropdown (single) ─────────────────────────────────────
  async selectAntDropdown(fieldKey, value, label = fieldKey) {
    if (!value) return;

    const { selector, group } = this.fields[fieldKey];
    const page = this.form.page;

    await page.locator(selector).click({ force: true });

    const dropdowns = page.locator(".ant-select-dropdown");
    await dropdowns.first().waitFor({ state: "attached" });

    const options = dropdowns.last().locator(".ant-select-item-option");
    await options.first().waitFor({ state: "visible" });

    const allTexts = [];
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      allTexts.push((await options.nth(i).innerText()).trim());
    }

    const index = allTexts.findIndex(
      (t) => t.toLowerCase() === String(value).toLowerCase()
    );

    let effectiveValue;

    if (index !== -1) {
      await options.nth(index).click();
      effectiveValue = allTexts[index];
    } else {
      await options.first().waitFor({ state: "visible", timeout: 5000 });
      await options.first().click();
      effectiveValue = allTexts[0];
      this.ctx.log(`[${label}] no match for "${value}", used "${effectiveValue}"`, "warn");
      this.ctx.addMismatch({
        field: fieldKey,
        expected: value,
        actual: effectiveValue,
        source: label,
      });
    }

    if (group !== "system") {
      this.ctx.setInput(group, fieldKey, effectiveValue);
    }
    this.ctx.setFinal(fieldKey, effectiveValue);
  }

  // ── Dropdown (multi) ──────────────────────────────────────
  async selectAntDropdownMulti(fieldKey, values = [], label = fieldKey) {
    if (!values?.length) return;

    const { selector, group } = this.fields[fieldKey];
    const page = this.form.page;

    await page.locator(selector).click({ force: true });

    const dropdowns = page.locator(".ant-select-dropdown");
    await dropdowns.first().waitFor({ state: "attached" });

    const options = dropdowns.last().locator(".ant-select-item-option");
    await options.first().waitFor({ state: "visible" });

    const allTexts = [];
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      allTexts.push((await options.nth(i).innerText()).trim());
    }

    const selected = [];
    const skipped = [];

    for (const val of values) {
      const index = allTexts.findIndex(
        (t) => t.toLowerCase() === String(val).toLowerCase()
      );

      if (index === -1) {
        skipped.push(val);
        this.ctx.log(`[${label}] option "${val}" not found`, "warn");
        this.ctx.addMismatch({
          field: fieldKey,
          expected: val,
          actual: "not found in dropdown",
          source: label,
        });
        continue;
      }

      const option = options.nth(index);
      await option.scrollIntoViewIfNeeded();
      await option.hover();
      await page.waitForTimeout(100);
      await option.click();
      selected.push(allTexts[index]);
      await page.waitForTimeout(200);
    }

    await page.keyboard.press("Escape");

    if (selected.length) {
      this.ctx.setInput(group, fieldKey, selected);
      this.ctx.setFinal(fieldKey, selected);
    }
  }

  // ── Checkbox ──────────────────────────────────────────────
  async setCheckbox(fieldKey, value) {
    if (value === undefined) return;

    const { selector, group } = this.fields[fieldKey];
    const checkbox = this.form.page.locator(selector);

    const isChecked = await checkbox.isChecked();
    if (Boolean(value) !== isChecked) await checkbox.click();

    this.ctx.setInput(group, fieldKey, Boolean(value));
    this.ctx.setFinal(fieldKey, Boolean(value));
  }

  // ── Radio ─────────────────────────────────────────────────
  async selectRadio(fieldKey, value) {
    if (value === undefined || value === null) return;

    const { group } = this.fields[fieldKey];
    const option = value ? "Yes" : "No";

    await this.form.page.getByRole("radio", { name: option }).click();

    this.ctx.setInput(group, fieldKey, option);
    this.ctx.setFinal(fieldKey, option);
  }

  // ── Validate: text input ──────────────────────────────────
  async validateField(fieldKey) {
    const expected = this.ctx.getFinal(fieldKey);
    if (!expected) return;

    const { selector } = this.fields[fieldKey];
    const actual = await this.form.page.locator(selector).inputValue();

    actual === expected
      ? this.ctx.log(`[${fieldKey}] matched`, "info")
      : this._recordMismatch(fieldKey, expected, actual);
  }

  // ── Validate: single dropdown ─────────────────────────────
  async validateDropdown(fieldKey) {
    const expected = this.ctx.getFinal(fieldKey);
    if (!expected) return;

    const { selector } = this.fields[fieldKey];
    const actual = (
      await this.form.page
        .locator(selector)
        .locator('xpath=ancestor::div[contains(@class,"ant-select")]')
        .locator(".ant-select-selection-item")
        .innerText()
    ).trim();

    actual === expected
      ? this.ctx.log(`[${fieldKey}] matched`, "info")
      : this._recordMismatch(fieldKey, expected, actual);
  }

  // ── Validate: multi dropdown ──────────────────────────────
  async validateMulti(fieldKey) {
    const expected = this.ctx.getFinal(fieldKey);
    if (!expected?.length) return;

    const { selector } = this.fields[fieldKey];
    const tags = this.form.page.locator(
      `${selector} >> xpath=ancestor::div[contains(@class,"ant-select")] >> .ant-select-selection-item`
    );
    const actual = (await tags.allTextContents()).map((t) => t.trim());

    for (const val of expected) {
      actual.map((t) => t.toLowerCase()).includes(val.toLowerCase())
        ? this.ctx.log(`[${fieldKey}] "${val}" present`, "info")
        : this._recordMismatch(`${fieldKey}:${val}`, val, "not found");
    }
  }

  // ── Validate: checkbox ────────────────────────────────────
  async validateCheckbox(fieldKey) {
    const expected = this.ctx.getFinal(fieldKey);
    if (expected === undefined || expected === null) return;

    const { selector } = this.fields[fieldKey];
    const actual = await this.form.page.locator(selector).isChecked();

    actual === Boolean(expected)
      ? this.ctx.log(`[${fieldKey}] matched (${actual})`, "info")
      : this._recordMismatch(fieldKey, Boolean(expected), actual);
  }

  // ── Validate: radio ───────────────────────────────────────
  async validateRadio(fieldKey) {
    const expected = this.ctx.getFinal(fieldKey);
    if (!expected) return;

    const isChecked = await this.form.page
      .getByRole("radio", { name: expected })
      .isChecked();

    isChecked
      ? this.ctx.log(`[${fieldKey}] "${expected}" selected`, "info")
      : this._recordMismatch(fieldKey, expected, "not selected");
  }

  // ── Shared mismatch recorder ──────────────────────────────
  _recordMismatch(field, expected, actual) {
    this.ctx.addMismatch({
      field,
      expected,
      actual,
      source: this.constructor.name,  // ← auto-tags which step class
    });
    this.ctx.log(
      `[${field}] expected="${expected}" actual="${actual}"`,
      "warn"
    );
  }
  
   _recordMatch(field) {
    this.ctx.log(` ${field} matched`, "info");
  }
}

module.exports = { BaseStep };