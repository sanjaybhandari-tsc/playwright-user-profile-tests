class TablePaginator {
  constructor(page) {
    this.page = page;

    // EDIT: update these if your pagination uses different selectors
    this.selectors = {
      nextBtn:     ".ant-pagination-next:not(.ant-pagination-disabled)",
      disabledBtn: ".ant-pagination-next.ant-pagination-disabled",
      rows:        ".ant-table-tbody .ant-table-row",
    };
  }

  // ── findRow ──────────────────────────────────────────────────
  // Paginates through all pages until it finds a row matching
  // the predicate. Returns the matching Locator or null.
  //
  // predicate: async (rowLocator) => boolean
  //
  // Usage:
  //   const row = await paginator.findRow(async (row) => {
  //     const text = await row.innerText();
  //     return text.includes(employeeId);
  //   });
  async findRow(predicate, { maxPages = 50 } = {}) {
    let page = 1;

    while (page <= maxPages) {
      // Wait for the table body to be visible on this page
      await this.page
        .locator(this.selectors.rows)
        .first()
        .waitFor({ state: "visible", timeout: 10000 })
        .catch(() => {}); // table might be empty — don't throw

      const rows = this.page.locator(this.selectors.rows);
      const count = await rows.count();

      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        const match = await predicate(row);
        if (match) return row;
      }

      // No match on this page — try to go to the next page
      const nextBtn = this.page.locator(this.selectors.nextBtn);
      const isDisabled = (await this.page.locator(this.selectors.disabledBtn).count()) > 0;

      if (isDisabled || (await nextBtn.count()) === 0) {
        // Last page reached — row not found
        return null;
      }

      await nextBtn.click();
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.waitForTimeout(400); // let table re-render

      page++;
    }

    throw new Error(`findRow: exceeded maxPages (${maxPages}) without finding the target row`);
  }

  // ── scrapeRow ────────────────────────────────────────────────
  // Given a row locator and an ordered list of column names,
  // returns a { columnName: cellText } object.
  //
  // columnNames must match the ORDER of <td> cells in the row.
  //
  // Usage:
  //   const data = await paginator.scrapeRow(row, [
  //     "Employee ID", "Name", "Department", "Designation", "Status"
  //   ]);
  async scrapeRow(rowLocator, columnNames) {
    const cells = rowLocator.locator("td");
    const count = await cells.count();
    const data  = {};

    for (let i = 0; i < count && i < columnNames.length; i++) {
      const name = columnNames[i];
      if (!name) continue; // pass null/undefined to skip a cell

      const text = (await cells.nth(i).innerText().catch(() => "")).trim();
      data[name] = text;
    }

    return data;
  }
}

module.exports = { TablePaginator };
