/**
 * addressInfo.steps.js
 * Steps for: address
 */

/**
 * @param {import('../pages/UserProfilePage').UserProfilePage} profilePage
 * @param {import('../form-engine/FieldHandlerFactory').FieldHandlerFactory} factory
 * @param {import('../context/TestContext').TestContext} ctx
 */
async function fillAddressInfo(profilePage, factory, ctx) {
  const text = factory.get('text');
  await text.fill(profilePage.addressInput, 'address', ctx.user.address);
}

module.exports = { fillAddressInfo };
