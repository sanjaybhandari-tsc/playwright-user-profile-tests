const { logger } = require('../helpers/logger');

class TextInputHandler {
  /**
   * @param {import('../context/Registry').Registry} registry
   */
  constructor(registry) {
    this.registry = registry;
  }

  /**
   * @param {import('@playwright/test').Locator} locator
   * @param {string} fieldName
   * @param {string} value
   */
  async fill(locator, fieldName, value) {
    this.registry.register(fieldName, value);
    await locator.clear();
    await locator.fill(String(value));
    this.registry.setPicked(fieldName, value);
    logger.info(`[${fieldName}] Filled: "${value}"`);
  }
}

module.exports = { TextInputHandler };
