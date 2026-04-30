const { logger } = require('../helpers/logger');

/**
 * DropdownOptionValidator — pre-checks whether expected values exist in dropdown options.
 * Run this BEFORE filling to get early warnings in the report.
 */
class DropdownOptionValidator {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /**
   * @param {import('@playwright/test').Locator} locator
   * @param {string} fieldName
   * @param {string} expectedValue
   * @returns {Promise<boolean>}
   */
  async validate(locator, fieldName, expectedValue) {
    const options  = await locator.locator('option').allTextContents();
    const found    = options.some(o => o.trim().toLowerCase().includes(expectedValue.trim().toLowerCase()));
    if (!found) {
      logger.warn(`[DropdownOptionValidator] "${expectedValue}" not found in "${fieldName}" options: [${options.join(', ')}]`);
    }
    return found;
  }
}

module.exports = { DropdownOptionValidator };
