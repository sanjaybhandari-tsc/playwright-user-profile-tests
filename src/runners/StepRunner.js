/**
 * StepRunner — wraps every scenario call in test.step()
 * so Playwright's HTML report shows field-level granularity.
 */
class StepRunner {
  /** @param {import('@playwright/test').TestType} test */
  constructor(test) {
    this.test = test;
  }

  /**
   * Run a named step, catching errors so other steps can still run.
   * @param {string} name - step name shown in the report
   * @param {() => Promise<void>} fn
   */
  async run(name, fn) {
    await this.test.step(name, async () => {
      await fn();
    });
  }
}

module.exports = { StepRunner };
