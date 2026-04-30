/**
 * personalInfo.steps.js
 * Steps for: firstName, lastName, email, phone, gender, dob
 */

/**
 * @param {import('../pages/UserProfilePage').UserProfilePage} profilePage
 * @param {import('../form-engine/FieldHandlerFactory').FieldHandlerFactory} factory
 * @param {import('../context/TestContext').TestContext} ctx
 */
async function fillPersonalInfo(profilePage, factory, ctx) {
  const { user } = ctx;
  const text = factory.get('text');
  const dropdown = factory.get('dropdown');
  const date = factory.get('date');

  await text.fill(profilePage.firstNameInput, 'firstName', user.firstName);
  await text.fill(profilePage.lastNameInput,  'lastName',  user.lastName);
  await text.fill(profilePage.emailInput,     'email',     user.email);
  await text.fill(profilePage.phoneInput,     'phone',     user.phone);
  await dropdown.fill(profilePage.genderDropdown, 'gender', user.gender, 'Prefer not to say');
  await date.fill(profilePage.dobInput, 'dob', user.dob);
}

module.exports = { fillPersonalInfo };
