const { expect } = require('@playwright/test');
const { logger } = require('../helpers/logger');

/**
 * TableValidator — cross-checks captured table data against registry final values.
 */
class TableValidator {
  /**
   * @param {import('../context/TestContext').TestContext} ctx
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * Assert that a specific column value in a table row matches a registry field.
   * @param {'table1'|'table2'} tableKey
   * @param {string} columnHeader
   * @param {string} registryField
   */
  assertColumnMatchesField(tableKey, columnHeader, registryField) {
    const rows   = this.ctx.tableData[tableKey];
    const record = this.ctx.registry.get(registryField);
    if (!rows || rows.length === 0) {
      logger.warn(`[TableValidator] ${tableKey} has no captured rows`);
      return;
    }
    if (!record) return;
    const tableValue = rows[0][columnHeader] || '';
    expect(tableValue.trim()).toBe(String(record.final).trim());
    logger.info(`[TableValidator] ${tableKey}["${columnHeader}"] matched registry["${registryField}"]`);
  }
}

module.exports = { TableValidator };
