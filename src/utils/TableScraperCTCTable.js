class TableScraper {
  constructor(page) {
    this.page = page;

    this.selectors = {
      // Section anchor — h3, not h2
      filterSection: 'div:has(h3:text-is("CTC Breakdown"))',

      // Filter controls
      filterIcon: '[aria-label="filter"]',
      filterModal: '[class*="department_deptFilterModalContainer__"]',
      filterKeyLabel: '[class*="department_filterKeys__"]',
      employeeNameKey:
        '[class*="department_filterKeys__"]:has-text("Employee Name")',
      clearFilterBtn:
        '[class*="department_deptFilterModalContainer__"] span:has-text("Clear Filters")',
      applyBtn:
        '[class*="department_deptFilterModalContainer__"] button:has(span:has-text("Apply"))',

      // Ant Select (only available after expanding Employee Name section)
      selectTrigger:
        '[class*="department_deptFilterModalContainer__"] .ant-select-selector',
      searchInput:
        '[class*="department_deptFilterModalContainer__"] .ant-select-selection-search-input',
      dropdownOpen: ".ant-select-dropdown:not(.ant-select-dropdown-hidden)",
      dropdownOption: ".ant-select-item-option",

      // Table
      tableWrapper: ".p-datatable-wrapper",
      tableHeaders: 'th[data-pc-section="headercell"] .p-column-title',
      bodyRows: 'tr[data-pc-section="bodyrow"]',
      bodyCells: 'td[data-pc-section="bodycell"]',
      frozenCell: 'td[data-p-frozen-column="true"]',

      // Employee cell — confirmed runPayroll_ classes
      employeeName: '[class*="runPayroll_tableText__"]',
      employeeId: 'td[data-p-frozen-column="true"] p.font_14',
      employeeAvatar: '[class*="runPayroll_roundedProfile__"]',

      // Filter input (modal-scoped)
      filterInput:
        '[class*="department_deptFilterModalContainer__"] [class*="department_filterKeys__"]:has-text("Employee Name")',
      employeeNameKey:
        '[class*="department_deptFilterModalContainer__"] [class*="department_filterKeys__"]:has-text("Employee Name")',
      // Add this to your selectors
      selectTrigger:
        '[class*="department_deptFilterModalContainer__"] .ant-select-selector',
      searchInput:
        '[class*="department_deptFilterModalContainer__"] .ant-select-selection-search-input',

      // The placeholder confirms it's the right select
      selectPlaceholder:
        '[class*="department_deptFilterModalContainer__"] .ant-select-selection-placeholder',
    };
  }

  // ── filterAndScrape ──────────────────────────────────────────
  // Main method — filters by employeeId, scrolls right collecting
  // all cells, returns a flat { columnName: cellText } object.
  //
  // columnNames: ordered array matching left-to-right <th> headers.
  //   Pass null for any column you want to skip.
  //   If the table has more <td>s than columnNames, extras are ignored.
  async filterAndScrape(employeeName, columnNames) {
    await this._openFilter();
    await this._expandAndSelect(employeeName);
    // await this._typeAndApply(employeeId);
    await this._waitForSingleRow();

    const data = await this._scrapeAllColumns(columnNames);

    await this._clearFilter();

    return data;
  }

  // ── _openFilter ──────────────────────────────────────────────
  async _openFilter() {
    try {
      // EDIT: if there are multiple filter icons (one per column),
      // scope this to the Employee ID column header specifically.
      // e.g. this.page.locator("th:has-text('Employee ID') .ant-table-filter-trigger")
      const icon = this.page.locator(this.selectors.filterIcon).first();
      await icon.waitFor({ state: "visible", timeout: 10000 });
      await icon.click();

      const modal = this.page.locator(this.selectors.filterModal);
      await modal.waitFor({ state: "visible", timeout: 5000 });
    } catch (err) {
      throw new Error(`_openFilter() failed: ${err.message}`);
    }
  }

  // ── _typeAndApply ────────────────────────────────────────────
  async _typeAndApply(employeeId) {
    try {
      const input = this.page.locator(this.selectors.filterInput);
      await input.waitFor({ state: "visible", timeout: 5000 });
      await input.fill("");
      await input.type(String(employeeId), { delay: 50 });

      const applyBtn = this.page.locator(this.selectors.applyBtn);
      await applyBtn.waitFor({ state: "visible", timeout: 5000 });
      await applyBtn.click();

      await this.page.waitForLoadState("domcontentloaded");
      await this.page.waitForTimeout(500); // let table re-render
    } catch (err) {
      throw new Error(`_typeAndApply("${employeeId}") failed: ${err.message}`);
    }
  }

  // ── _waitForSingleRow ────────────────────────────────────────
  async _waitForSingleRow() {
    try {
      const row = this.page.locator(this.selectors.resultRow).first();
      await row.waitFor({ state: "visible", timeout: 10000 });
    } catch (err) {
      throw new Error(
        `_waitForSingleRow() failed — no row appeared after filter: ${err.message}`,
      );
    }
  }
  async _waitForSingleRow() {
    try {
      const row = this.page.locator(this.selectors.bodyRows).first(); // ← was resultRow
      await row.waitFor({ state: "visible", timeout: 10000 });
    } catch (err) {
      throw new Error(`_waitForSingleRow() failed: ${err.message}`);
    }
  }

  // ── _scrapeAllColumns ────────────────────────────────────────
  // Scrolls the table horizontally in steps, reading new cells
  // as they become visible. Deduplicates cells by index so
  // partially-visible cells are not double-counted.

  async _scrapeAllColumns(columnNames) {
    const row = this.page.locator(this.selectors.bodyRows).first();
    await row.waitFor({ state: "visible", timeout: 10000 });

    const cellTexts = await row.evaluate((tr) => {
      return [...tr.querySelectorAll('td[data-pc-section="bodycell"]')].map(
        (td) => td.innerText.trim().replace(/\n+/g, " "),
      );
    });

    // Build result
    const result = {};
    for (let i = 0; i < columnNames.length; i++) {
      const name = columnNames[i];
      if (!name) continue;
      result[name] = (cellTexts[i] ?? '').replace(/,/g, '');
    }

    // Clean Employee Name — extract name and ID separately
    if (result["Employee Name"]) {
      const match = result["Employee Name"].match(/([A-Za-z ]+)\s+\(([^)]+)\)/);
      if (match) {
        result["Employee Name"] = match[1].trim();
        result["_employeeId"] = match[2].trim();
      }
    }

    // Normalize "-" → "" (app renders empty fields as dash)
    for (const key of Object.keys(result)) {
      if (result[key] === "-" || result[key] === "--") result[key] = "";
    }

    return result;
  }

  // ── _clearFilter ─────────────────────────────────────────────
  // Resets the filter so the next user starts with a clean table.

  async _clearFilter() {
    try {
      const icon = this.page.locator(this.selectors.filterIcon).first();
      await icon.click();
      const modal = this.page.locator(this.selectors.filterModal);
      await modal.waitFor({ state: "visible", timeout: 5000 });

      const resetBtn = this.page.locator(this.selectors.clearFilterBtn); // ← was resetBtn
      if ((await resetBtn.count()) > 0) {
        await resetBtn.first().click();
        await this.page.waitForTimeout(400);
      }
    } catch (err) {
      console.warn(`_clearFilter() failed (non-fatal): ${err.message}`);
    }
  }
  async filterByEmployeeName(employeeName) {
    // 1. Open the filter modal
    await this.page.click(this.selectors.filterIcon);
    await this.page.waitForSelector(this.selectors.filterModal);

    // 2. Click "Employee Name" to expand and render the input
    await this.page.click(
      '[class*="employeeFilterModalContainer"] [class*="filterKeys"]:has-text("Employee Name")',
    );

    // 3. Wait for ant-select to appear in DOM (it wasn't there before)
    await this.page.waitForSelector(
      '[class*="employeeFilterModalContainer"] .ant-select-selector',
    );

    // 4. Click the select box to open the dropdown
    await this.page.click(
      '[class*="employeeFilterModalContainer"] .ant-select-selector',
    );

    // 5. Wait for dropdown to open
    await this.page.waitForSelector(this.selectors.dropdownOpen);

    // 6. Type to search
    await this.page.type(this.selectors.searchInput, employeeName);

    // 7. Click the matching option in dropdown
    await this.page.click(`.ant-select-item-option[title="${employeeName}"]`);

    // 8. Apply
    await this.page.click(this.selectors.applyBtn);
    await this.page.waitForSelector(this.selectors.bodyRows);
  }
  async scrapeEmployees(employeeNames) {
    const results = [];
    for (const name of employeeNames) {
      // 1. Filter table to that employee
      await this.filterByEmployeeName(name);
      // 2. Scrape the filtered result
      const data = await this.scrapeRow();
      results.push(data);
      // 3. Clear filter before next employee
      await this.clearFilter();
    }
    return results;
  }

  async _expandAndSelect(employeeName) {
    try {
      // Step 1 — click "Employee Name" label to expand accordion
      await this.page.click(this.selectors.employeeNameKey);

      // Step 2 — wait for ant-select to render
      await this.page.waitForSelector(this.selectors.selectTrigger, {
        timeout: 5000,
      });

      // Step 3 — click selector to open dropdown
      await this.page.click(this.selectors.selectTrigger);

      // Step 4 — wait for dropdown to open
      await this.page.waitForSelector(this.selectors.dropdownOpen, {
        timeout: 5000,
      });

      // Step 5 — type via keyboard (input is opacity:0/readonly, keyboard events work)
      await this.page.keyboard.type(employeeName, { delay: 50 });

      // Step 6 — match by text content (case-insensitive, avoids title casing issues)
      const option = this.page
        .locator(
          `.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content`,
        )
        .filter({ hasText: employeeName });
      await option.waitFor({ state: "visible", timeout: 7000 });
      await option.click();

      // Step 7 — click Apply
      const applyBtn = this.page.locator(this.selectors.applyBtn);
      await applyBtn.waitFor({ state: "visible", timeout: 5000 });
      await applyBtn.click();

      await this.page.waitForTimeout(500);
    } catch (err) {
      throw new Error(
        `_expandAndSelect("${employeeName}") failed: ${err.message}`,
      );
    }
  }
  
}

module.exports = { TableScraper };
