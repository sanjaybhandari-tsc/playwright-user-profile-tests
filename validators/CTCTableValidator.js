class CTCTableValidator {
  constructor(page, context) {
    this.page = page;
    this.ctx = context;
  }
  // Validates CTC Breakdown UI against computed/expected finance values
async validate(ctx, page, rowMap) {
  // Loop through all CTC fields defined in selector map
  for (const [field, selector] of Object.entries(rowMap)) {
    //Extract actual UI value from CTC table cell
    const actual = await page.locator(selector).innerText()
    //Build expected value from finance context
    // IMPORTANT:
    // CTC is NOT direct input comparison — it is finance-driven
    const expected =
      ctx.input.financeDetails?.[field] ||   // direct finance input
      ctx.generated?.[field] ||              // system values if any
      ctx.fallback?.[field];                 // fallback UI values
    // Store actual UI snapshot in context
    ctx.ui.ctcTable[field] = actual;
    // Compare values only if expected exists
    if (expected && normalize(expected) !== normalize(actual)) {
      //Record mismatch for final report
      ctx.addMismatch({
        table: "ctc",        // identifies CTC breakdown table
        field,
        expected,
        actual
      });
    }
  }
}


  
}