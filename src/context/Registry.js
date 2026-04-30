/**
 * Registry — tracks value lifecycle for every field.
 * Precedence: provided → picked (from dropdown) → fallback → final
 */
class Registry {
  constructor() {
    /** @type {Record<string, { provided: any, picked: any, fallback: any, final: any, usedFallback: boolean }>} */
    this.fields = {};
  }

  /**
   * Register a field with its provided (fixture) value and optional fallback.
   * @param {string} fieldName
   * @param {any} providedValue
   * @param {any} [fallbackValue]
   */
  register(fieldName, providedValue, fallbackValue = null) {
    this.fields[fieldName] = {
      provided:     providedValue,
      picked:       null,
      fallback:     fallbackValue,
      final:        null,
      usedFallback: false
    };
  }

  /**
   * Record what was actually picked/filled in the UI.
   * @param {string} fieldName
   * @param {any} pickedValue
   */
  setPicked(fieldName, pickedValue) {
    if (!this.fields[fieldName]) this.register(fieldName, null);
    this.fields[fieldName].picked = pickedValue;
    this.fields[fieldName].final  = pickedValue;
  }

  /**
   * Mark that the fallback was used for a field.
   * @param {string} fieldName
   */
  setFallbackUsed(fieldName) {
    if (!this.fields[fieldName]) return;
    this.fields[fieldName].usedFallback = true;
    this.fields[fieldName].final        = this.fields[fieldName].fallback;
  }

  /**
   * Get the full record for a field.
   * @param {string} fieldName
   */
  get(fieldName) {
    return this.fields[fieldName] || null;
  }

  /**
   * Get fields that used fallback (useful for report warnings).
   * @returns {string[]}
   */
  getFallbackFields() {
    return Object.entries(this.fields)
      .filter(([, v]) => v.usedFallback)
      .map(([k]) => k);
  }

  /**
   * Get a flat summary of final values.
   * @returns {Record<string, any>}
   */
  getSummary() {
    const out = {};
    for (const [key, val] of Object.entries(this.fields)) {
      out[key] = { final: val.final, usedFallback: val.usedFallback };
    }
    return out;
  }

  reset() {
    this.fields = {};
  }
}

module.exports = { Registry };
