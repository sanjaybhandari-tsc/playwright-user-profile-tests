const { expect } = require("@playwright/test");
const { BaseStep } = require("./BaseStep");
const { fallbackRegistry } = require("../../data/fallbackRegistry");

class StepPersonalDetails extends BaseStep {
  constructor(form, readModel, ctx) {
    super(form, readModel, ctx);

    this.fields = {
      firstName: {
        selector: "#employeeForm_first_name",
        group: "personal",
      },
      middleName: {
        selector: "#employeeForm_middle_name",
        group: "personal",
      },
      lastName: {
        selector: "#employeeForm_last_name",
        group: "personal",
      },
      dob: {
        selector: "#employeeForm_birthday",
        group: "personal",
      },
      gender: {
        selector: "#employeeForm_gender",
        group: "personal",
      },
      maritalStatus: {
        selector: "#employeeForm_marital_status",
        group: "personal",
      },
      phone: {
        selector: '#employeeForm_phone input[type="tel"]',
        group: "personal",
      },
      series: {
        selector: "#employeeForm_series_id",
        group: "personal",
      },
      joiningDate: {
        selector: "#employeeForm_joining_date",
        group: "personal",
      },
      skills: {
        selector: "#employeeForm_skills",
        group: "personal",
      },
      employeeId: {
        selector: "#employeeForm_employee_id",
        group: "system",
      },
    };
    this.form.registerFields(this.fields);
  }
  setMaritalStatus(value) {
    this.state.maritalStatus = value;
  }
  async applyMaritalStatus() {
    if (!this.state.maritalStatus) return;

    await this.form.select(
      "#employeeForm_marital_status",
      this.state.maritalStatus,
    );
  }

  async fill(rawData) {
    const data = { ...fallbackRegistry.personalDetails };
    for (const [key, val] of Object.entries(rawData || {})) {
      if (val !== null && val !== undefined && val !== "") {
        data[key] = val;
      }
    }
    console.log("data", data);

    // const stepContainer = this.page.locator('.work-detail-step');
    // await expect(stepContainer).toBeVisible();

    await this.form.fill("firstName", data.firstName);
    await this.form.fill("middleName", data.middleName);
    await this.form.fill("lastName", data.lastName);
    // await this.fillDateOfBirth(data.dateOfBirth);
    await this.fillDate("dob", data.dateOfBirth);
    await this.selectGender(data.gender);
    await this.selectMaritalStatus(data.maritalStatus);
    await this.fillPhoneNumber(data.phone);
    // await this.selectDropdown(this.fields.series, data.series);
    await this.selectEmployeeSeries("series", data.employeeSeries);
    await this.fillDate("joiningDate", data.joiningDate);
    await this.form.page.waitForTimeout(3000);
    // await this.captureEmployeeId();
    await this.selectSkills(data.skills);
    // await this.form.pause(5000);
    //  await this.checkForValidationErrors();
  }

  // async captureEmployeeId() {
  //   const locator = this.form.page.locator(this.fields.employeeId.selector); //
  //   await locator.waitFor({ state: "visible" });
  //   const id = await locator.inputValue();

  //   if (!id) {
  //     this.ctx.log("captureEmployeeId: no value found", "warn");
  //     return;
  //   }

  //   this.ctx.setEmployeeId(id); //  goes to ctx.generated.employeeId
  //   this.ctx.setGenerated("employeeId", id); //  also tracked in generated map
  //   this.ctx.log(`captureEmployeeId: captured "${id}"`, "info");
  // }
  async captureEmployeeId() {
    const locator = this.form.page.locator(this.fields.employeeId.selector);

    await locator.waitFor({ state: "visible" });

    // ← wait until value is actually populated
    await expect(locator).not.toHaveValue("", { timeout: 10000 });

    const id = await locator.inputValue();

    if (!id) {
      this.ctx.log("captureEmployeeId: no value found", "warn");
      return;
    }

    this.ctx.setEmployeeId(id);
    this.ctx.setGenerated("employeeId", id);
    this.ctx.log(`captureEmployeeId: captured "${id}"`, "info");
  }

  async selectEmployeeSeries(fieldKey, value) {
    if (!value) return; //  guard on value, not selector

    const { selector } = this.fields[fieldKey]; //  resolve selector
    const page = this.form.page;

    console.log("Opening dropdown");
    await page.locator(selector).click({ force: true }); //  use resolved selector

    const dropdowns = page.locator(".ant-select-dropdown");
    await dropdowns.first().waitFor({ state: "attached" });

    const activeDropdown = dropdowns.last();
    const options = activeDropdown.locator(".ant-select-item-option");

    await page.waitForFunction(() => {
      return document.querySelectorAll(".ant-select-item-option").length > 0;
    });

    const count = await options.count();
    const allTexts = [];
    for (let i = 0; i < count; i++) {
      const text = (await options.nth(i).innerText()).trim();
      allTexts.push(text);
    }

    console.log("Expected:", value);
    console.log("Available:", allTexts);

    const index = allTexts.findIndex(
      (t) => t.toLowerCase() === value.toLowerCase(),
    );

    if (index !== -1) {
      await options.nth(index).click();
      this.ctx.setInput("work", fieldKey, value); //  track to ctx
      this.ctx.setFinal(fieldKey, value);
    } else {
      console.log(" No match, selecting first");
      const fallback = (await options.first().innerText()).trim();
      await options.first().click();
      this.ctx.setInput("work", fieldKey, fallback); //  track fallback too
      this.ctx.setFinal(fieldKey, fallback);
      this.ctx.log(
        `series: no match for "${value}", used "${fallback}"`,
        "warn",
      );
    }
  }

  async selectGender(value) {
    await this.form.click(this.fields.gender.selector); //
    const dropdown = this.form.page.locator(".ant-select-dropdown:visible");
    await dropdown.waitFor();
    const option = dropdown.locator("span", { hasText: value }).first();
    await option.click();
  }

  async selectMaritalStatus(value) {
    await this.form.click(this.fields.maritalStatus.selector);
    const input = this.form.page.locator(this.fields.maritalStatus.selector);
    await this.form.page.waitForTimeout(300);
    // type value (filters dropdown)
    await input.press("Control+A");
    await input.type(value);
    await this.form.page.waitForTimeout(300);
    await input.press("Enter");
  }

  async fillDate(fieldKey, dateString) {
    if (!dateString) return;
    const { selector, group } = this.fields[fieldKey]; //

    await this.form.click(selector);
    await this.form.page.locator(selector).fill(dateString);
    await this.form.press("Enter");

    //  manual ctx tracking since we bypassed FormEngine.fill()
    this.ctx.setInput(group, fieldKey, dateString);
    this.ctx.setFinal(fieldKey, dateString);
  }

  async fillPhoneNumber(number) {
    if (!number) return;
    const input = this.form.page
      .locator('label:has-text("Phone")')
      .locator('xpath=ancestor::div[contains(@class,"ant-form-item")]')
      .locator('input[type="tel"]');
    await input.waitFor({ state: "visible" });
    // extract last 10 digits only
    const normalized = number.replace(/\D/g, "").slice(-10);
    await input.click();
    await input.fill("");
    await input.type(normalized, { delay: 50 });
  }

  async selectSkills(skills = []) {
    const page = this.form.page;
    const input = page.locator(this.fields.skills.selector);

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];

      console.log(" Selecting skill:", skill);

      // 1. focus input (don't click repeatedly if not needed)
      await input.click();

      // (it deletes selected tags)
      // await input.press('Control+A');
      // await input.press('Backspace');

      //  Instead: just type (AntD clears search automatically)
      await input.type(skill, { delay: 50 });

      const dropdowns = page.locator(".ant-select-dropdown");
      await dropdowns.first().waitFor({ state: "attached" });

      const activeDropdown = dropdowns.last();
      const options = activeDropdown.locator(".ant-select-item-option");

      await options.first().waitFor();

      const allTexts = (await options.allTextContents()).map((t) => t.trim());

      console.log("Options:", allTexts);

      const index = allTexts.findIndex(
        (t) => t.toLowerCase() === skill.toLowerCase(),
      );

      if (index !== -1) {
        await options.nth(index).click();
      } else {
        await options.first().click();
      }

      //  small wait for tag to render
      await page.waitForTimeout(200);
    }

    //  close dropdown once at ends
    await input.press("Escape");
  }

  async validate(data) {
    const safeRun = async (fn, label) => {
      try {
        await fn();
      } catch (err) {
        this.ctx.log(`[${label}] ${err.message}`, "error");
        this.ctx.addMismatch({
          field: label,
          expected: "no error",
          actual: err.message,
          source: this.constructor.name,
        });
        throw err; // ← re-throw
      }
    };

    await safeRun(() => this.validateFirstName(data.firstName), "firstName");
    await safeRun(() => this.validateMiddleName(data.middleName), "middleName");
    await safeRun(() => this.validateLastName(data.lastName), "lastName");
    await safeRun(() => this.validateDOB(data.dateOfBirth), "dateOfBirth");
    await safeRun(() => this.validateGender(data.gender), "gender");
    await safeRun(
      () => this.validateMaritalStatus(data.maritalStatus),
      "maritalStatus",
    );
    await safeRun(() => this.validatePhone(data.phone), "phone");
    await safeRun(
      () => this.validateEmployeeSeries(data.employeeSeries),
      "employeeSeries",
    );
    await safeRun(
      () => this.validateJoiningDate(data.joiningDate),
      "joiningDate",
    );
    await safeRun(() => this.validateSkills(data.skills), "skills");
    // await safeRun(() => this.validateFirstName(data.firstName));
    // await safeRun(() => this.validateMiddleName(data.middleName));
    // await safeRun(() => this.validateLastName(data.lastName));
    // await safeRun(() => this.validateDOB(data.dateOfBirth));
    // await safeRun(() => this.validateGender(data.gender));
    // await safeRun(() => this.validateMaritalStatus(data.maritalStatus));
    // await safeRun(() => this.validatePhone(data.phone));
    // await safeRun(() => this.validateEmployeeSeries(data.employeeSeries));
    // await safeRun(() => this.validateJoiningDate(data.joiningDate));
    // await safeRun(() => this.validateSkills(data.skills));
  }

  async validateFirstName(value) {
    if (!value) return;

    let actual = await this.form.page
      .locator(this.fields.firstName.selector)
      .inputValue();

    console.log("First Name → Expected:", value);
    console.log("First Name → Actual:", actual);

    if (actual === value) {
      console.log(" First Name matches");
    } else {
      console.log(" First Name mismatch");
    }
    if (actual === value) {
      this._recordMatch("firstName");
    } else {
      this._recordMismatch("firstName", value, actual); //  goes to ctx
    }

    actual === value
      ? this._recordMatch("firstName")
      : this._recordMismatch("firstName", value, actual);
  }

  async validateMiddleName(value) {
    if (!value) return;

    let actual = await this.form.page
      .locator(this.fields.middleName.selector)
      .inputValue();

    console.log("Middle Name → Expected:", value);
    console.log("Middle Name → Actual:", actual);

    console.log(actual === value ? " Match" : " Mismatch");

    actual === value
      ? this._recordMatch("middleName")
      : this._recordMismatch("middleName", value, actual);
  }

  async validateLastName(value) {
    if (!value) return;
    let actual = await this.form.page
      .locator(this.fields.lastName.selector)
      .inputValue();
    actual === value
      ? this._recordMatch("lastName")
      : this._recordMismatch("lastName", value, actual);
  }

  async validateDOB(value) {
    if (!value) return;

    let actual = await this.form.page
      .locator(this.fields.dob.selector)
      .inputValue();

    console.log("DOB → Expected:", value);
    console.log("DOB → Actual:", actual);

    console.log(actual === value ? " Match" : " Mismatch");

    actual === value
      ? this._recordMatch("dob")
      : this._recordMismatch("dob", value, actual);
  }

  async validateJoiningDate(value) {
    if (!value) return;

    let actual = await this.form.page
      .locator(this.fields.joiningDate.selector)
      .inputValue();

    console.log("Joining Date → Expected:", value);
    console.log("Joining Date → Actual:", actual);

    console.log(actual === value ? " Match" : " Mismatch");

    actual === value
      ? this._recordMatch("joiningDate")
      : this._recordMismatch("joiningDate", value, actual);
  }

  async validateGender(value) {
    if (!value) return;

    try {
      const { selector } = this.fields.gender; // ← destructure selector
      const selected = this.form.page
        .locator(selector) // ← use selector string
        .locator('xpath=ancestor::div[contains(@class,"ant-select")]')
        .locator(".ant-select-selection-item");

      const actual = (await selected.innerText()).trim();

      actual === value
        ? this._recordMatch("gender")
        : this._recordMismatch("gender", value, actual);
    } catch (err) {
      this.ctx.log(`validateGender: ${err.message}`, "error");
      throw new Error(`validateGender failed: ${err.message}`);
    }
  }

  async validateMaritalStatus(value) {
    if (!value) return;

    try {
      const { selector } = this.fields.maritalStatus; // ← fix
      const selected = this.form.page
        .locator(selector)
        .locator('xpath=ancestor::div[contains(@class,"ant-select")]')
        .locator(".ant-select-selection-item");

      const actual = (await selected.innerText()).trim();

      actual === value
        ? this._recordMatch("maritalStatus")
        : this._recordMismatch("maritalStatus", value, actual);
    } catch (err) {
      this.ctx.log(`validateMaritalStatus: ${err.message}`, "error");
      throw new Error(`validateMaritalStatus failed: ${err.message}`);
    }
  }

  async validateEmployeeSeries(value) {
    if (!value) return;

    try {
      const { selector } = this.fields.series; // ← fix
      const selected = this.form.page
        .locator(selector)
        .locator('xpath=ancestor::div[contains(@class,"ant-select")]')
        .locator(".ant-select-selection-item");

      let actual;
      try {
        actual = (await selected.innerText()).trim();
      } catch {
        this.ctx.log("validateEmployeeSeries: could not read UI value", "warn");
        return;
      }

      if (!actual) return;

      actual === value
        ? this._recordMatch("series")
        : this._recordMismatch("series", value, actual);
    } catch (err) {
      this.ctx.log(`validateEmployeeSeries: ${err.message}`, "error");
      throw new Error(`validateEmployeeSeries failed: ${err.message}`);
    }
  }

  async validatePhone(value) {
    if (!value) return;
    const input = this.form.page
      .locator('label:has-text("Phone")')
      .locator('xpath=ancestor::div[contains(@class,"ant-form-item")]')
      .locator('input[type="tel"]');

    const raw = await input.inputValue();
    const normalized = raw.replace(/\D/g, "").slice(-10);

    normalized === value
      ? this._recordMatch("phone")
      : this._recordMismatch("phone", value, normalized);
  }

  // async validateSkills(skills = []) {
  //   if (!skills.length) return;

  //   const tags = this.form.page.locator(
  //     `${this.fields.skills} >> xpath=ancestor::div[contains(@class,"ant-select")] >> .ant-select-selection-item`
  //   );

  //   const allTexts = (await tags.allTextContents()).map(t => t.trim());

  //   console.log("Skills → Expected:", skills);
  //   console.log("Skills → Actual:", allTexts);

  //   for (const skill of skills) {
  //     const exists = allTexts
  //       .map(t => t.toLowerCase())
  //       .includes(skill.toLowerCase());

  //     console.log(`Skill "${skill}" → ${exists ? " Present" : " Missing"}`);

  //     expect(
  //       allTexts.map(t => t.toLowerCase())
  //     ).toContain(skill.toLowerCase());
  //   }
  // }
  async validateSkills(skills = []) {
    if (!skills.length) return;

    const tags = this.form.page.locator(
      `${this.fields.skills.selector} >> xpath=ancestor::div[contains(@class,"ant-select")] >> .ant-select-selection-item`,
    );
    const allTexts = (await tags.allTextContents()).map((t) =>
      t.trim().toLowerCase(),
    );

    for (const skill of skills) {
      if (allTexts.includes(skill.toLowerCase())) {
        this._recordMatch(`skill:${skill}`);
      } else {
        this._recordMismatch(`skill:${skill}`, skill, "not found"); //
      }
    }
  }

  _recordMatch(field) {
    this.ctx.log(` ${field} matched`, "info");
  }
}

module.exports = { StepPersonalDetails };
