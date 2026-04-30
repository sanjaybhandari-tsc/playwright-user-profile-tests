const { expect } = require("@playwright/test");
class FormReadModel {
  constructor(page) {
    this.page = page;
  }

  async expectValue(selector, value) {
    if (!value) return;
    await expect(this.page.locator(selector)).toHaveValue(value);
  }

  async expectText(selector, value) {
    if (!value) return;
    await expect(this.page.locator(selector)).toContainText(value);
  }

  async expectListItem(text) {
    await expect(
      this.page.locator('.ant-select-selection-item', {
        hasText: text
      })
    ).toBeVisible();
  }
}

module.exports = { FormReadModel };