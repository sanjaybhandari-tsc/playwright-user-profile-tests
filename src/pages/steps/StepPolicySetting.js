const { expect } = require("@playwright/test");
const { BaseStep } = require("./BaseStep");
const { fallbackRegistry } = require("../../data/fallbackRegistry");
class StepPolicySetting extends BaseStep{
 constructor(form, readModel, ctx) {
    super(form, readModel, ctx);

    this.fields = {
      isProbationDurationApplicable: {
        selector: 'input[name="probation_enabled"]',
        group: "policy",
      },
      onboardingPolicy: {
        selector: "#employeeForm_probation_id",
        group: "policy",
      },
      shiftPolicy: {
        selector: "#employeeForm_shift_policy_id",
        group: "policy",
      },
      attendancePolicy: {
        selector: "#employeeForm_attendance_policy_id",
        group: "policy",
      },
      leavePolicy: {
        selector: "#employeeForm_leave_policy_id",
        group: "policy",
      },
      reimbursementPolicy: {
        selector: "#employeeForm_expense_policy_id",
        group: "policy",
      },
      offboardingPolicy: {
        selector: "#employeeForm_offboarding_policy_id",
        group: "policy",
      },
      overtimePolicy: {
        selector: "#employeeForm_overtime_policy_id",
        group: "policy",
      },
      protectDocumentRestrictedAccess: {
        selector:
          'div:has(span.ms-2:text("Protect document with restricted access.")) input.ant-checkbox-input',
        group: "policy",
      },
    };
    this.form.registerFields(this.fields);
  }

    async fill(rawData) {
    const data = { ...fallbackRegistry.policySetting, };
    for (const [key, val] of Object.entries(rawData || {})) {
    if (val !== null && val !== undefined && val !== "") {
      data[key] = val;
    }
  }
  console.log("data",data);
    // if (data.workEmail) {await this.form.fill(this.selectors.workEmail, data.workEmail)}
    // if (typeof data.isProbationDurationApplicable === "boolean") {
    //   await this.selectRadio(
    //     "isProbationDurationApplicable",
    //     data.isProbationDurationApplicable,
    //   );
    // }

    if (data.onboardingPolicy) {
      await this.selectAntDropdown(
        "onboardingPolicy",
        data.onboardingPolicy,
      );
    }
    if (data.shiftPolicy) {
      await this.selectAntDropdown(
        "shiftPolicy",
        data.shiftPolicy,
      );
    }
    if (data.attendancePolicy) {
      await this.selectAntDropdown(
        "attendancePolicy",
        data.attendancePolicy,
      );
    }
    if (data.leavePolicy) {
      await this.selectAntDropdown(
        "leavePolicy",
        data.leavePolicy,
      );
    }
    if (data.reimbursementPolicy) {
      await this.selectAntDropdown(
        "reimbursementPolicy",
        data.reimbursementPolicy,
      );
    }
    if (data.offboardingPolicy) {
      await this.selectAntDropdown(
        "offboardingPolicy",
        data.offboardingPolicy,
      );
    }
    if (data.overtimePolicy) {
      await this.selectAntDropdown(
        "overtimePolicy",
        data.overtimePolicy,
      );
    }

    // if (data.protectDocumentRestrictedAccess !== undefined) {
    //   await this.setCheckbox(protectDocumentRestrictedAccess);
    // }
    // await this.form.pause(7000);
  }

  async validate() {  //no data arg needed — ctx has everything
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

   // await safeRun(() => this.validateRadio("isProbationDurationApplicable"), "isProbationDurationApplicable");

await safeRun(() => this.validateDropdown("onboardingPolicy"), "onboardingPolicy");
await safeRun(() => this.validateDropdown("shiftPolicy"), "shiftPolicy");
await safeRun(() => this.validateDropdown("attendancePolicy"), "attendancePolicy");
await safeRun(() => this.validateDropdown("leavePolicy"), "leavePolicy");
await safeRun(() => this.validateDropdown("reimbursementPolicy"), "reimbursementPolicy");
await safeRun(() => this.validateDropdown("offboardingPolicy"), "offboardingPolicy");
await safeRun(() => this.validateDropdown("overtimePolicy"), "overtimePolicy");

// await safeRun(() => this.validateField("workEmail"), "workEmail");
// await safeRun(() => this.validateMulti("associateManager"), "associateManager");
}

}

module.exports = { StepPolicySetting };
