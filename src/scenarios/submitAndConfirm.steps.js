/**
 * submitAndConfirm.steps.js
 * Steps for: submitting the form and confirming success
 */
const { expect } = require('@playwright/test');

/**
 * @param {import('../pages/UserProfilePage').UserProfilePage} profilePage
 */
async function submitAndConfirm(profilePage) {
  await profilePage.submit();
  await expect(profilePage.successMessage).toBeVisible();
}

module.exports = { submitAndConfirm };
