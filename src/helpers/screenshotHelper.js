const path = require('path');

/**
 * screenshotHelper — auto-capture on step failure.
 * Call this in a test's afterEach or inside a catch block.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} label - descriptive name for the screenshot file
 */
async function captureOnFailure(page, label) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName  = path.join('reports', 'screenshots', `${label}-${timestamp}.png`);
  await page.screenshot({ path: fileName, fullPage: true });
  console.log(`[screenshotHelper] Saved: ${fileName}`);
}

module.exports = { captureOnFailure };
