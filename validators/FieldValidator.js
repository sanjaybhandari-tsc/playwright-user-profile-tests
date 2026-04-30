const { expect } = require('@playwright/test');
const { logger } = require('../helpers/logger');

/**
 * FieldValidator — asserts that final registry values match what's in the UI.
 */
class FieldValidator {
  /**
   * @param {import('../context/Registry').Registry} registry
   */
  constructor(registry) {
    this.registry = registry;
  }

  /**
   * Warn (don't fail) if a field used a fallback value.
   */
  warnOnFallbacks() {
    const fallbacks = this.registry.getFallbackFields();
    if (fallbacks.length > 0) {
      logger.warn(`Fields that used fallback values: ${fallbacks.join(', ')}`);
    }
  }

  /**
   * Assert that an input locator's value matches the registry's final value.
   * @param {import('@playwright/test').Locator} locator
   * @param {string} fieldName
   */
  async assertFieldValue(locator, fieldName) {
    const record = this.registry.get(fieldName);
    if (!record || record.final === null) return;
    const actual = await locator.inputValue();
    expect(actual.trim()).toBe(String(record.final).trim());
  }
}

module.exports = { FieldValidator };
