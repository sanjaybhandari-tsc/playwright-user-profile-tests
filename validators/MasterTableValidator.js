class MasterTableValidator {
  constructor(page, context) {
    this.page = page;
    this.ctx = context;
  }

// Validates Master Table UI against input + system + fallback context
async validate(ctx, page, rowMap) {

  // Loop through all fields defined for Master Table
  for (const [field, selector] of Object.entries(rowMap)) {

    //Read actual value from UI (Master Table cell)
    const actual = await page.locator(selector).innerText();

    //Build expected value from different sources
    // Priority order:
    // 1. User input (Excel/JSON)
    // 2. System generated values (employeeId etc.)
    // 3. Fallback values (auto-filled UI defaults)
    const expected =
      ctx.input.personal?.[field] ||
      ctx.generated?.[field] ||
      ctx.fallback?.[field];

    //Store UI value in context for reporting/debugging
    ctx.ui.masterTable[field] = actual;

    //Compare only if expected exists
    // (ignore fields not part of dataset)
    if (expected && normalize(expected) !== normalize(actual)) {

      //Record mismatch for report generation
      ctx.addMismatch({
        table: "master",        // which table failed
        field,                  // field name
        expected,               // what we expected
        actual                  // what UI showed
      });
    }
  }
}
}