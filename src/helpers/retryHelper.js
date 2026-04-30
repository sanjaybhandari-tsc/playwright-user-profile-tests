/**
 * retryHelper — retry an async action N times with a delay between attempts.
 * Useful for flaky dropdown loading or network-dependent UI.
 *
 * @param {() => Promise<void>} fn
 * @param {number} [retries=3]
 * @param {number} [delayMs=500]
 */
async function retry(fn, retries = 3, delayMs = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await fn();
      return;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`[retryHelper] Attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

module.exports = { retry };
