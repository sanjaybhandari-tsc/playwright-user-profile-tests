const { BasePage } = require('./BasePage');

/**
 * UserProfilePage — all locators for the user creation form.
 * Add / adjust selectors to match your actual app.
 */
class UserProfilePage extends BasePage {
  constructor(page) {
    super(page);

    // Personal info
    this.firstNameInput  = page.locator('#firstName');
    this.lastNameInput   = page.locator('#lastName');
    this.emailInput      = page.locator('#email');
    this.phoneInput      = page.locator('#phone');
    this.genderDropdown  = page.locator('#gender');
    this.dobInput        = page.locator('#dob');

    // Address
    this.addressInput    = page.locator('#address');

    // Role & department
    this.departmentDropdown = page.locator('#department');
    this.roleDropdown       = page.locator('#role');

    // Submit
    this.submitButton    = page.locator('button#submit');
    this.successMessage  = page.locator('.success-toast');

    // Tables
    this.table1          = page.locator('#profileSummaryTable');
    this.table2          = page.locator('#auditTable');
  }

  async openCreateForm() {
    await this.navigate('/users/create');
    await this.waitForPageReady();
  }

  async submit() {
    await this.submitButton.click();
    await this.successMessage.waitFor({ state: 'visible', timeout: 15_000 });
  }
}

module.exports = { UserProfilePage };
