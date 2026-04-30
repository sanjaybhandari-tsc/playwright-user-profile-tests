const { UserProfilePage }     = require('../pages/UserProfilePage');
const { LoginPage }           = require('../pages/LoginPage');
const { FieldHandlerFactory } = require('../form-engine/FieldHandlerFactory');
const { fillPersonalInfo }    = require('../scenarios/personalInfo.steps');
const { fillAddressInfo }     = require('../scenarios/addressInfo.steps');
const { fillRolePermissions } = require('../scenarios/rolePermissions.steps');
const { submitAndConfirm }    = require('../scenarios/submitAndConfirm.steps');
const { Table1Capture }       = require('../tables/Table1Capture');
const { Table2Capture }       = require('../tables/Table2Capture');
const { FieldValidator }      = require('../validators/FieldValidator');
const { TableValidator }      = require('../validators/TableValidator');
const { StepRunner }          = require('./StepRunner');
const { logger }              = require('../helpers/logger');

/**
 * UserProfileRunner — orchestrates one full user profile creation test.
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('../context/TestContext').TestContext} ctx
 * @param {import('@playwright/test').TestType} test
 */
async function runUserProfileTest(page, ctx, test) {
  const profilePage = new UserProfilePage(page);
  const loginPage   = new LoginPage(page);
  const factory     = new FieldHandlerFactory(page, ctx.registry);
  const runner      = new StepRunner(test);
  const t1Capture   = new Table1Capture(page);
  const t2Capture   = new Table2Capture(page);
  const fieldVal    = new FieldValidator(ctx.registry);
  const tableVal    = new TableValidator(ctx);

  // ── 1. Login
  await runner.run('Login', async () => {
    await loginPage.login(process.env.USERNAME, process.env.PASSWORD);
  });

  // ── 2. Open form
  await runner.run('Open create user form', async () => {
    await profilePage.openCreateForm();
  });

  // ── 3. Fill form sections
  await runner.run('Fill personal info', async () => {
    await fillPersonalInfo(profilePage, factory, ctx);
  });

  await runner.run('Fill address info', async () => {
    await fillAddressInfo(profilePage, factory, ctx);
  });

  await runner.run('Fill role & permissions', async () => {
    await fillRolePermissions(profilePage, factory, ctx);
  });

  // ── 4. Submit
  await runner.run('Submit form', async () => {
    await submitAndConfirm(profilePage);
  });

  // ── 5. Capture table data
  await runner.run('Capture table 1 (profile summary)', async () => {
    await t1Capture.captureAndStore(profilePage, ctx);
  });

  await runner.run('Capture table 2 (audit log)', async () => {
    await t2Capture.captureAndStore(profilePage, ctx);
  });

  // ── 6. Validate
  await runner.run('Validate field values', async () => {
    fieldVal.warnOnFallbacks();
    await fieldVal.assertFieldValue(profilePage.firstNameInput, 'firstName');
    await fieldVal.assertFieldValue(profilePage.emailInput,     'email');
  });

  await runner.run('Validate table data', async () => {
    tableVal.assertColumnMatchesField('table1', 'Email',      'email');
    tableVal.assertColumnMatchesField('table1', 'Department', 'department');
  });

  // ── 7. Log summary
  logger.info(`[User ${ctx.user.id}] Summary: ${JSON.stringify(ctx.getSummary(), null, 2)}`);
}

module.exports = { runUserProfileTest };
