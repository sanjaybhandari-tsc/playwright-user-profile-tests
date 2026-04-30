class ValidationEngine {
  constructor(page, context) {
    this.page = page;
    this.ctx = context;
  }

  record(field, expected, actual) {
    if (expected !== actual) {
      this.ctx.logMismatch(field, expected, actual);
    }
  }
}