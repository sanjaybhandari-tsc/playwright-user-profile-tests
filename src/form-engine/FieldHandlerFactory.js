const { DropdownHandler } = require('./DropdownHandler');
const { TextInputHandler } = require('./TextInputHandler');
const { DatePickerHandler } = require('./DatePickerHandler');

/**
 * FieldHandlerFactory — returns the right handler for a given field type.
 * Extend this as you add new field types (radio, checkbox, file upload, etc.)
 */
class FieldHandlerFactory {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('../context/Registry').Registry} registry
   */
  constructor(page, registry) {
    this.page     = page;
    this.registry = registry;
    this._dropdown = new DropdownHandler(page, registry);
    this._text     = new TextInputHandler(registry);
    this._date     = new DatePickerHandler(registry);
  }

  /**
   * @param {'dropdown'|'text'|'date'} type
   */
  get(type) {
    switch (type) {
      case 'dropdown': return this._dropdown;
      case 'text':     return this._text;
      case 'date':     return this._date;
      default: throw new Error(`Unknown field type: "${type}"`);
    }
  }
}

module.exports = { FieldHandlerFactory };
