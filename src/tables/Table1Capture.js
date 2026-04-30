const { TableCapture } = require('./TableCapture');

/**
 * Table1Capture — scrapes the Profile Summary table.
 */
class Table1Capture extends TableCapture {
  constructor(page) {
    super(page);
  }

  /**
   * @param {import('../pages/UserProfilePage').UserProfilePage} profilePage
   * @param {import('../context/TestContext').TestContext} ctx
   */
  async captureAndStore(profilePage, ctx) {
    const rows = await this.scrape(profilePage.table1);
    ctx.setTableData('table1', rows);
    return rows;
  }
}

module.exports = { Table1Capture };
