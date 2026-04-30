/**
 * rolePermissions.steps.js
 * Steps for: department, role
 */

/**
 * @param {import('../pages/UserProfilePage').UserProfilePage} profilePage
 * @param {import('../form-engine/FieldHandlerFactory').FieldHandlerFactory} factory
 * @param {import('../context/TestContext').TestContext} ctx
 */
async function fillRolePermissions(profilePage, factory, ctx) {
  const dropdown = factory.get('dropdown');
  await dropdown.fill(profilePage.departmentDropdown, 'department', ctx.user.department, 'General');
  await dropdown.fill(profilePage.roleDropdown,       'role',       ctx.user.role,       'Viewer');
}

module.exports = { fillRolePermissions };
