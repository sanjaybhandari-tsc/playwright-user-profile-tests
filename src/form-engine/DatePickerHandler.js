const { logger } = require('../helpers/logger');

class DatePickerHandler {
  /**
   * @param {import('../context/Registry').Registry} registry
   */
  constructor(registry) {
    this.registry = registry;
  }

  /**
   * Handles both native <input type="date"> and custom date pickers.
   * @param {import('@playwright/test').Locator} locator
   * @param {string} fieldName
   * @param {string} dateValue - format: YYYY-MM-DD
   */
  async fill(locator, fieldName, dateValue) {
    this.registry.register(fieldName, dateValue);
    const inputType = await locator.getAttribute('type');
    if (inputType === 'date') {
      await locator.fill(dateValue);
    } else {
      // Custom date picker — type the value and press Enter
      await locator.click();
      await locator.fill(dateValue);
      await locator.press('Enter');
    }
    this.registry.setPicked(fieldName, dateValue);
    logger.info(`[${fieldName}] Date set: "${dateValue}"`);
  }
}

module.exports = { DatePickerHandler };
