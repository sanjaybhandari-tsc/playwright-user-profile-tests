const { TableCapture } = require('./TableCapture');

/**
 * Table2Capture — scrapes the Audit/Activity table.
 */
class Table2Capture extends TableCapture {
  constructor(page) {
    super(page);
  }

  /**
   * @param {import('../pages/UserProfilePage').UserProfilePage} profilePage
   * @param {import('../context/TestContext').TestContext} ctx
   */
  async captureAndStore(profilePage, ctx) {
    const rows = await this.scrape(profilePage.table2);
    ctx.setTableData('table2', rows);
    return rows;
  }
}

module.exports = { Table2Capture };
