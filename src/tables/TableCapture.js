/**
 * TableCapture — base class for scraping UI tables.
 * Always waits for the table to be visible before scraping.
 */
class TableCapture {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /**
   * Generic table scraper — returns array of row objects keyed by header.
   * @param {import('@playwright/test').Locator} tableLocator
   * @returns {Promise<Record<string,string>[]>}
   */
  async scrape(tableLocator) {
    await tableLocator.waitFor({ state: 'visible', timeout: 15_000 });

    const headers = await tableLocator.locator('thead th').allTextContents();
    const rows    = await tableLocator.locator('tbody tr').all();

    const result = [];
    for (const row of rows) {
      const cells  = await row.locator('td').allTextContents();
      const rowObj = {};
      headers.forEach((h, i) => { rowObj[h.trim()] = (cells[i] || '').trim(); });
      result.push(rowObj);
    }
    return result;
  }
}

module.exports = { TableCapture };
