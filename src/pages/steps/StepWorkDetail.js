const { expect } = require("@playwright/test");
const { BaseStep } = require("./BaseStep");
const { fallbackRegistry } = require("../../data/fallbackRegistry");
class StepWorkDetail extends BaseStep {
  constructor(form, readModel, ctx) {
    super(form, readModel, ctx);

    this.fields = {
      workEmail: {
        selector: "#employeeForm_email",
        group: "work",
      },
      location: {
        selector: "#employeeForm_location",
        group: "work",
      },
      role: {
        selector: "#employeeForm_role_id",
        group: "work",
      },
      employmentStatus: {
        selector: "#employeeForm_employment_status",
        group: "work",
      },
      employmentType: {
        selector: "#employeeForm_employee_type",
        group: "work",
      },
      workMode: {
        selector: "#employeeForm_work_mode",
        group: "work",
      },
      businessUnit: {
        selector: "#employeeForm_Business_Unit",
        group: "work",
      },
      holidayPlan: {
        selector: "#employeeForm_holiday_plan_id",
        group: "work",
      },
      department: {
        selector: "#employeeForm_department_name",
        group: "work",
      },
      organizationName: {
        selector: "#employeeForm_organization_name",
        group: "work",
      },
      designation: {
        selector: "#employeeForm_designation",
        group: "work",
      },
      grade: {
        selector: "#employeeForm_grade_id",
        group: "work",
      },
      band: {
        selector: "#employeeForm_band_id",
        group: "work",
      },
      reportingManager: {
        selector: "#employeeForm_reporting_manager",
        group: "work",
      },
      hrManager: {
        selector: "#employeeForm_reporting_hr",
        group: "work",
      },
      l2Manager: {
        selector: "#employeeForm_l2_manager",
        group: "work",
      },
      associateManager: {
        selector: "#employeeForm_associate_managers",
        group: "work",
      },
      protectDocumentRestrictedAccess: {
        selector:
          'div:has(span.ms-2:text("Protect document with restricted access.")) input.ant-checkbox-input',
        group: "work",
      },
    };
    this.form.registerFields(this.fields);
  }

  async fill(rawData) {
    const data = { ...fallbackRegistry.workDetails };
    for (const [key, val] of Object.entries(rawData || {})) {
      if (val !== null && val !== undefined && val !== "") {
        data[key] = val;
      }
    }
    console.log("data", data);

    if (data.workEmail) {
      await this.form.fill("workEmail", data.workEmail);
    }
    if (data.location) {
      await this.selectLocation("location", data.location);
    }
    if (data.role) {
      await this.selectAntDropdown("role", data.role);
    }

    if (data.employmentStatus) {
      await this.selectAntDropdown("employmentStatus", data.employmentStatus);
    }

    if (data.employmentType) {
      await this.selectAntDropdown("employmentType", data.employmentType);
    }

    if (data.workMode) {
      await this.selectAntDropdown("workMode", data.workMode);
    }

    if (data.businessUnit) {
      await this.selectAntDropdown("businessUnit", data.businessUnit);
    }
    if (data.holidayPlan) {
      await this.selectAntDropdown("holidayPlan", data.holidayPlan);
    }

    if (data.department) {
      await this.selectAntDropdown("department", data.department);
    }
    if (data.designation) {
      await this.selectAntDropdown("designation", data.designation);
    }

    if (data.grade) {
      await this.selectAntDropdown("grade", data.grade);
    }

    if (data.band) {
      await this.selectAntDropdownBand("band", data.band);
    }

    if (data.reportingManager) {
      await this.selectAntDropdown("reportingManager", data.reportingManager);
    }

    if (data.hrManager) {
      await this.selectAntDropdown("hrManager", data.hrManager);
    }

    if (data.l2Manager) {
      await this.selectAntDropdown("l2Manager", data.l2Manager);
    }

    if (data.associateManager) {
      await this.selectAntDropdownMulti(
        "associateManager",
        data.associateManager,
      );
    }

    // Checkbox using form layer
    if (data.protectDocumentRestrictedAccess !== undefined) {
      await this.setCheckbox(
        "protectDocumentRestrictedAccess",
        data.protectDocumentRestrictedAccess,
      );
    }
    // await this.form.pause(5000);
  }

  async selectLocation(fieldKey, value) {
    if (!fieldKey || !value) return;

    const { selector, group } = this.fields[fieldKey]; //  resolve from fields
    const page = this.form.page;

    const element = page.locator(selector);
    await element.waitFor({ state: "visible" });
    await element.click({ force: true });

    const dropdowns = page.locator(".ant-select-dropdown");
    await dropdowns.first().waitFor({ state: "attached" });

    const activeDropdown = dropdowns.last();
    const options = activeDropdown.locator(".ant-select-item-option");

    await options.first().waitFor({ state: "visible" });

    const count = await options.count();
    if (count === 0) {
      this.ctx.log(`selectLocation "${fieldKey}": no options found`, "warn");
      return;
    }

    const allTexts = [];
    for (let i = 0; i < count; i++) {
      allTexts.push((await options.nth(i).innerText()).trim());
    }

    const index = allTexts.findIndex(
      (t) => t.toLowerCase() === value.toLowerCase(),
    );

    let effectiveValue;

    if (index !== -1) {
      await options.nth(index).click();
      effectiveValue = allTexts[index];
      this.ctx.log(
        `selectLocation "${fieldKey}": matched "${effectiveValue}"`,
        "info",
      );
    } else {
      const firstOption = options.first();
      await firstOption.waitFor({ state: "visible", timeout: 5000 });
      await firstOption.click();
      effectiveValue = allTexts[0];
      this.ctx.log(
        `selectLocation "${fieldKey}": no match for "${value}", used "${effectiveValue}"`,
        "warn",
      );
      this.ctx.addMismatch({
        field: fieldKey,
        expected: value,
        actual: effectiveValue,
        source: "selectLocation",
      });
    }

    //  track to ctx
    this.ctx.setInput(group, fieldKey, effectiveValue);
    this.ctx.setFinal(fieldKey, effectiveValue);
  }

  async selectAntDropdownBand(fieldKey, value, label = fieldKey) {
    if (!value) return;

    const { selector, group } = this.fields[fieldKey];
    const page = this.form.page;

    await page.locator(selector).click({ force: true });

    const dropdowns = page.locator(".ant-select-dropdown");
    await dropdowns.first().waitFor({ state: "attached" });

    const options = dropdowns.last().locator(".ant-select-item-option");
    await options.first().waitFor({ state: "visible" });

    const count = await options.count();
    await page.waitForTimeout(500);
    const allTexts = (await options.allInnerTexts()).map(t => t.trim());

    const index = allTexts.findIndex(
      (t) => t.toLowerCase() === String(value).toLowerCase()
    );

    let effectiveValue;

    if (index !== -1) {
      await options.nth(index).click();
      effectiveValue = allTexts[index];
    } else {
      await options.first().waitFor({ state: "visible", timeout: 5000 });
      await options.first().click();
      effectiveValue = allTexts[0];
      this.ctx.log(`[${label}] no match for "${value}", used "${effectiveValue}"`, "warn");
      this.ctx.addMismatch({
        field: fieldKey,
        expected: value,
        actual: effectiveValue,
        source: label,
      });
    }

    if (group !== "system") {
      this.ctx.setInput(group, fieldKey, effectiveValue);
    }
    this.ctx.setFinal(fieldKey, effectiveValue);
  }

  async validate() {
    //  no data arg needed — ctx has everything
    const safeRun = async (fn, label) => {
  try { await fn(); }
  catch (err) {
    this.ctx.log(`[${label}] ${err.message}`, "error");
    this.ctx.addMismatch({
      field: label,
      expected: "no error",
      actual: err.message,
      source: this.constructor.name,
    });
    throw err;  // ← re-throw
  }
};

    await safeRun(() => this.validateField("workEmail"), "workEmail");
await safeRun(() => this.validateDropdown("location"), "location");
await safeRun(() => this.validateDropdown("role"), "role");
await safeRun(() => this.validateDropdown("employmentStatus"), "employmentStatus");
await safeRun(() => this.validateDropdown("employmentType"), "employmentType");
await safeRun(() => this.validateDropdown("workMode"), "workMode"); // typo fixed
await safeRun(() => this.validateDropdown("businessUnit"), "businessUnit");
await safeRun(() => this.validateDropdown("holidayPlan"), "holidayPlan");
await safeRun(() => this.validateDropdown("department"), "department");
await safeRun(() => this.validateDropdown("designation"), "designation"); // was missing
await safeRun(() => this.validateDropdown("organizationName"), "organizationName");
await safeRun(() => this.validateDropdown("grade"), "grade");
await safeRun(() => this.validateDropdown("band"), "band");
await safeRun(() => this.validateDropdown("reportingManager"), "reportingManager");
await safeRun(() => this.validateDropdown("hrManager"), "hrManager");
await safeRun(() => this.validateDropdown("l2Manager"), "l2Manager");
await safeRun(() => this.validateMulti("associateManager"), "associateManager");
  }
}

module.exports = { StepWorkDetail };
