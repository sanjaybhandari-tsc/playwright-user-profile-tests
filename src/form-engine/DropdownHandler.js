const { logger } = require('../helpers/logger');

/**
 * DropdownHandler — resolves backend-driven dropdowns.
 * Strategy: wait for options → find exact match → try partial match → use fallback → log warning
 */
class DropdownHandler {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('../context/Registry').Registry} registry
   */
  constructor(page, registry) {
    this.page     = page;
    this.registry = registry;
  }

  /**
   * Fill a <select> or custom dropdown.
   * @param {import('@playwright/test').Locator} locator - the dropdown element
   * @param {string} fieldName - registry key
   * @param {string} providedValue - value from fixture
   * @param {string} [fallbackValue] - value to use if provided is not found
   */
  async fill(locator, fieldName, providedValue, fallbackValue = null) {
    this.registry.register(fieldName, providedValue, fallbackValue);

    // Wait for the dropdown to have options (backend data loaded)
    await this.page.waitForFunction(
      (sel) => {
        const el = document.querySelector(sel);
        return el && el.options && el.options.length > 1;
      },
      await locator.evaluate(el => el.id ? `#${el.id}` : null),
      { timeout: 10_000 }
    ).catch(() => logger.warn(`[${fieldName}] Dropdown options did not load in time`));

    const options = await locator.locator('option').allTextContents();
    const normalizedOptions = options.map(o => o.trim().toLowerCase());
    const normalizedTarget  = providedValue.trim().toLowerCase();

    // 1. Exact match
    const exactIdx = normalizedOptions.indexOf(normalizedTarget);
    if (exactIdx !== -1) {
      await locator.selectOption({ label: options[exactIdx].trim() });
      this.registry.setPicked(fieldName, options[exactIdx].trim());
      logger.info(`[${fieldName}] Picked exact: "${options[exactIdx].trim()}"`);
      return;
    }

    // 2. Partial match
    const partialIdx = normalizedOptions.findIndex(o => o.includes(normalizedTarget));
    if (partialIdx !== -1) {
      await locator.selectOption({ label: options[partialIdx].trim() });
      this.registry.setPicked(fieldName, options[partialIdx].trim());
      logger.warn(`[${fieldName}] Partial match used: "${options[partialIdx].trim()}" for "${providedValue}"`);
      return;
    }

    // 3. Fallback
    if (fallbackValue) {
      const fallbackIdx = normalizedOptions.findIndex(o => o.includes(fallbackValue.trim().toLowerCase()));
      if (fallbackIdx !== -1) {
        await locator.selectOption({ label: options[fallbackIdx].trim() });
        this.registry.setFallbackUsed(fieldName);
        logger.warn(`[${fieldName}] Fallback used: "${options[fallbackIdx].trim()}"`);
        return;
      }
    }

    // 4. Cannot fill — log and skip
    logger.error(`[${fieldName}] No match found for "${providedValue}" in options: ${options.join(', ')}`);
  }
}

module.exports = { DropdownHandler };
