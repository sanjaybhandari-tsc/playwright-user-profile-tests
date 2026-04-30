const { expect } = require("@playwright/test");
class CreateUserPage {
  constructor(page) {
    this.page = page;

    this.selectors = {
      employeeTab: "tab=Employee List",
      addEmployeeBtn: 'button:has-text("Add Employee")',
      nextBtn: 'button:has-text("Next")',
      backBtn: 'button:has-text("Back")',
    };
  }

  async goto() {
    try {
      await this.page.goto("/employee-management");
      await this.page.waitForLoadState("domcontentloaded");

      const employeeTab = this.page.getByRole("tab", { name: "Employee List" });
      await employeeTab.waitFor({ state: "visible" });
      await employeeTab.click();

      const addBtn = this.page.getByRole("button", { name: "Add Employee" });
      await addBtn.waitFor({ state: "visible" });
      await addBtn.click();
    } catch (err) {
      throw new Error(`goto() failed: ${err.message}`);
    }
  }
  async goto() {
    try {
      await this.page.goto("/employee-management");
      // await this.page.waitForTimeout(2000);
      // await this.page.reload();
      // const employeeTab = this.page.getByRole("tab", { name: "Employee List" });
      // await employeeTab.waitFor();
      // await employeeTab.click();
      const employeeTab = this.page.getByRole("tab", { name: "Employee List" });
      await employeeTab.click();

      // const addBtn = this.page.getByRole("button", { name: "Add Employee" });
      // await addBtn.waitFor();
      // await addBtn.click();
      const addBtn = this.page.getByRole("button", { name: "Add Employee" });
      await addBtn.click();
    } catch (err) {
      throw new Error(`goto() failed: ${err.message}`);
    }
  }

  async expectDrawerOpen() {
    try {
      const drawer = this.page.locator(".ant-drawer-header");
      // await expect(drawer).toBeVisible();
      await expect(drawer).toBeVisible({ timeout: 10000 });
      await expect(drawer.getByText("Add Employee")).toBeVisible();
    } catch (err) {
      throw new Error(`Drawer did not open: ${err.message}`);
    }
  }

  //  NAVIGATION
  // async nextStep() {
  //   const btn = this.page.getByRole("button", { name: "Next" });
  //   // await btn.waitFor();
  //   await expect(btn).toBeVisible();
  //   await expect(btn).toBeEnabled();
  //   await btn.click();
  //   await this.page.waitForTimeout(500);
  // }
  async nextStep() {
    try {
      const btn = this.page.getByRole("button", { name: "Next" });
      await btn.waitFor({ state: "visible" });
      await expect(btn).toBeEnabled({ timeout: 5000 });
      await btn.click();
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.waitForTimeout(500);
    } catch (err) {
      throw new Error(`nextStep() failed: ${err.message}`);
    }
  }
  async nextStep() {
    try {
      const btn = this.page.getByRole("button", { name: "Next" });
      await btn.waitFor({ state: "visible" });
      await expect(btn).toBeEnabled();
      await this.page.waitForLoadState("domcontentloaded"); // ← wait for DOM to settle
      await this.page.waitForTimeout(500); // ← small buffer for animations
      await btn.click();
      await this.page.waitForTimeout(500);
    } catch (err) {
      throw new Error(`nextStep() failed: ${err.message}`);
    }
  }

async prevStep() {
  try {
    const btn = this.page.getByRole("button", { name: "Back" });
    await btn.waitFor({ state: "visible" });
    await btn.click();
  } catch (err) {
    throw new Error(`prevStep() failed: ${err.message}`);
  }
}

  async createEmployee() {
    try {
      const btn = this.page.getByRole("button", { name: "Create" });
      await expect(btn).toBeVisible();
      await expect(btn).toBeEnabled();
      await btn.click();
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.waitForTimeout(500);
    } catch (err) {
      throw new Error(`createEmployee() failed: ${err.message}`);
    }
  }
  async createEmployee() {
    try {
      const btn = this.page.getByRole("button", { name: "Create" });
      await expect(btn).toBeVisible();
      await expect(btn).toBeEnabled();
      await btn.click();
      await this.page.waitForTimeout(500);
    } catch (err) {
      throw new Error(`createEmployee() failed: ${err.message}`);
    }
  }

  async handleOnboardingEmailPopup(sendEmail = false) {
    const modal = this.page.locator(".ant-modal-content");
    await expect(modal).toBeVisible({ timeout: 10000 });

    if (sendEmail) {
      const checkbox = modal.locator('input[type="checkbox"]');
      await checkbox.check();
    }
    await modal.getByRole("button", { name: "Confirm" }).click();
    // ← wait specifically for success toast text
    const successToast = this.page.locator(".custom_toast_css_success");
    await successToast.waitFor({ state: "visible", timeout: 15000 });
    const message = (await successToast.innerText()).trim();
    if (!message.includes("Employee profile created successfully")) {
      throw new Error(`Unexpected toast: "${message}"`);
    }
    return message;
  }
  async handleOnboardingEmailPopup(sendEmail = false) {
    try {
      const modal = this.page.locator(".ant-modal-content");
      await modal.waitFor({ state: "visible", timeout: 10000 });

      if (sendEmail) {
        const checkbox = modal.locator('input[type="checkbox"]');
        await checkbox.check();
      }

      await modal.getByRole("button", { name: "Confirm" }).click();

      const successToast = this.page.locator(".custom_toast_css_success");
      await successToast.waitFor({ state: "visible", timeout: 15000 });
      const message = (await successToast.innerText()).trim();

      return message; // ← let the spec/flow assert on content, not this method
    } catch (err) {
      throw new Error(`handleOnboardingEmailPopup() failed: ${err.message}`);
    }
  }
  async handleOnboardingEmailPopup(sendEmail = false) {
  try {
    const modal = this.page.locator(".ant-modal-content");
    await modal.waitFor({ state: "visible", timeout: 10000 });

    if (sendEmail) {
      await modal.locator('input[type="checkbox"]').check();
    }

    await modal.getByRole("button", { name: "Confirm" }).click();
    // Toast waiting is now handled by errorCapture.waitForSuccessToast()
  } catch (err) {
    throw new Error(`handleOnboardingEmailPopup() failed: ${err.message}`);
  }
}
}

module.exports = { CreateUserPage };
