const { expect } = require("@playwright/test");
const { BaseStep } = require("./BaseStep");
const { fallbackRegistry } = require("../../data/fallbackRegistry");
class StepFinancialDetails extends BaseStep {
  constructor(form, readModel, ctx) {
    super(form, readModel, ctx);

    this.fields = {
      legalEntity: { selector: "#employeeForm_legal_entity", group: "finance" },
      payGroup: { selector: "#employeeForm_paygroup", group: "finance" },
      ctc: { selector: "#employeeForm_ctc", group: "finance" },
      taxRegime: { selector: "#employeeForm_regime", group: "finance" },

      // payroll checkboxes
      providentFundEligible: {
        selector:
          'label:has-text("Provident Fund (PF) eligible") input[type="checkbox"]',
        group: "finance",
      },
      esiEligible: {
        selector: 'label:has-text("ESI eligible") input[type="checkbox"]',
        group: "finance",
      },
      lwfEligible: {
        selector: 'label:has-text("LWF eligible") input[type="checkbox"]',
        group: "finance",
      },
    };

    this.form.registerFields(this.fields);
  }
  // getBonusSelectors(index) {
  //   const base = `#employeeForm_bonuses_${index}`;
  //   return {
  //     bonusName: `${base}_bonus_id`,
  //     bonusType: `${base}_bonus_amount`,
  //     value: `${base}_bonus_amount`,
  //     percentage: `${base}_bonus_percentage`,
  //     payoutMonth: `${base}_pay_date`,
  //     note: `${base}_note`,
  //   };
  // }
  getBonusFields(index) {
    const base = `#employeeForm_bonuses_${index}`;
    return {
      [`bonus_${index}_bonusName`]: {
        selector: `${base}_bonus_id`,
        group: "finance",
      },
      [`bonus_${index}_bonusType`]: {
        selector: `${base}_bonus_type`,
        group: "finance",
      },
      [`bonus_${index}_value`]: {
        selector: `${base}_bonus_amount`,
        group: "finance",
      },
      [`bonus_${index}_percentage`]: {
        selector: `${base}_bonus_percentage`,
        group: "finance",
      },
      [`bonus_${index}_payoutMonth`]: {
        selector: `${base}_pay_date`,
        group: "finance",
      },
      [`bonus_${index}_note`]: { selector: `${base}_note`, group: "finance" },
    };
  }

  async fill(rawData) {
    console.log("FINANCE RAW:", JSON.stringify(rawData, null, 2));
    const data = { ...fallbackRegistry.financeDetails };
    for (const [key, val] of Object.entries(rawData || {})) {
      if (val !== null && val !== undefined && val !== "") {
        data[key] = val;
      }
    }
    console.log("FINANCE MERGED:", JSON.stringify(data, null, 2));
    console.log("data", data);
    // if (!data) return;

    // ── Static dropdowns ──────────────────────────────────────
    if (data.legalEntity)
      await this.selectAntDropdown("legalEntity", data.legalEntity);
    if (data.payGroup) await this.selectAntDropdown("payGroup", data.payGroup);
    if (data.taxRegime)
      await this.selectAntDropdown("taxRegime", data.taxRegime);

    // ── CTC ───────────────────────────────────────────────────
    if (data.ctc) await this.form.fill("ctc", data.ctc);

    // ── Payroll checkboxes (top-level) ────────────────────────
    if (data.providentFundEligible !== undefined)
      await this.setCheckbox(
        "providentFundEligible",
        data.providentFundEligible,
      );
    if (data.esiEligible !== undefined)
      await this.setCheckbox("esiEligible", data.esiEligible);
    if (data.lwfEligible !== undefined)
      await this.setCheckbox("lwfEligible", data.lwfEligible);

    // ── Payroll checkboxes (nested under payrollDetails) ──────
    if (data.payrollDetails?.providentFundEligible !== undefined)
      await this.setCheckbox(
        "providentFundEligible",
        data.payrollDetails.providentFundEligible,
      );
    if (data.payrollDetails?.esiEligible !== undefined)
      await this.setCheckbox("esiEligible", data.payrollDetails.esiEligible);
    if (data.payrollDetails?.lwfEligible !== undefined)
      await this.setCheckbox("lwfEligible", data.payrollDetails.lwfEligible);

    // ── Bonuses ───────────────────────────────────────────────
    if (data.bonuses?.length) {
      const page = this.form.page;
      const bonusSection = page.locator('div:has-text("Bonus")');

      for (let i = 0; i < data.bonuses.length; i++) {
        const bonusData = data.bonuses[i];

        // 1. add bonus row
        await bonusSection.getByRole("button", { name: /Add Bonus/i }).click();

        // 2. register this bonus's dynamic fields
        const bonusFields = this.getBonusFields(i);
        this.form.registerFields(bonusFields); //  merges into FormEngine
        Object.assign(this.fields, bonusFields);
        // 3. select bonus name
        if (bonusData.bonusName) {
          await this.selectAntDropdown(
            `bonus_${i}_bonusName`,
            bonusData.bonusName,
          );
        }
        ``;
        // 4. detect value vs percentage field
        const valueField = page.locator(
          bonusFields[`bonus_${i}_value`].selector,
        );
        const percentageField = page.locator(
          bonusFields[`bonus_${i}_percentage`].selector,
        );

        const winner = await Promise.race([
          valueField
            .waitFor({ state: "attached", timeout: 3000 })
            .then(() => "value"),
          percentageField
            .waitFor({ state: "attached", timeout: 3000 })
            .then(() => "percentage"),
        ]);

        if (winner === "value") {
          this.ctx.log(`bonus_${i}: value field detected`, "info");
          await this.form.fill(`bonus_${i}_value`, bonusData.value);
          bonusData.bonusType = "value"; // ← tag it
        } else {
          this.ctx.log(`bonus_${i}: percentage field detected`, "info");
          await this.form.fill(`bonus_${i}_percentage`, bonusData.percentage);
          bonusData.bonusType = "percentage"; // ← tag it
        }

        // 5. payout month + note
        if (bonusData.payoutMonth) {
          await this.fillMonth(`bonus_${i}_payoutMonth`, bonusData.payoutMonth);
        }
        if (bonusData.note) {
          await this.form.fill(`bonus_${i}_note`, bonusData.note);
        }

        // 6. save bonus card
        const bonusCard = page.locator(".border.mt-3.p-3.rounded").nth(i);
        await bonusCard.getByRole("button", { name: "Save" }).click();

        this.ctx.log(`bonus_${i}: saved`, "info");
      }
      this.ctx.setFinal("bonusCount", data.bonuses.length);
      this.ctx.setFinal("bonuses", data.bonuses);
    }
  }

  async selectAntDropdown(fieldKey, value, label = fieldKey) {
  if (!value) return;

  const { selector, group } = this.fields[fieldKey];
  const page = this.form.page;

  // Open the dropdown
  await page.locator(selector).click({ force: true });

  // Wait for ANY visible dropdown (use first, not strict)
  const dropdown = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
  await dropdown.waitFor({ state: 'visible', timeout: 5000 });

  // Type into the search input using the selector's ID
  // e.g. "#employeeForm_legal_entity" → search input inside it
  const searchInput = page.locator(`${selector}-search-input, input[id="${selector.replace('#', '')}"]`);
  
  // Fallback — type via keyboard since input may be opacity:0
  await page.keyboard.type(String(value), { delay: 50 });

  // Wait for filtered results
  await page.waitForTimeout(500);

  // Scroll down inside dropdown to load all filtered options
  await dropdown.evaluate(el => el.scrollTop += 300);
  await page.waitForTimeout(300);

  const options = dropdown.locator('.ant-select-item-option');
  await options.first().waitFor({ state: 'visible', timeout: 5000 });

  const allTexts = [];
  const count = await options.count();
  for (let i = 0; i < count; i++) {
    allTexts.push((await options.nth(i).innerText()).trim());
  }

  console.log(`[${fieldKey}] filtered options for "${value}":`, allTexts);

  const matchIndex = allTexts.findIndex(
    (t) => t.toLowerCase() === String(value).toLowerCase(),
  );

  let effectiveValue;

  if (matchIndex !== -1) {
    await options.nth(matchIndex).click();
    effectiveValue = allTexts[matchIndex];
  } else {
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

  async fillMonth(fieldKey, value) {
    if (!value) return;

    const { selector, group } = this.fields[fieldKey]; //
    const page = this.form.page; //
    const input = page.locator(selector);

    await input.click();
    await input.fill(String(value)); //
    await input.blur();

    this.ctx.setInput(group, fieldKey, value);
    this.ctx.setFinal(fieldKey, value);
    this.ctx.log(`fillMonth "${fieldKey}": set to "${value}"`, "info");
  }

  async validate() {
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

    // ── Static fields ─────────────────────────────────────────
    await safeRun(() => this.validateDropdown("legalEntity"), "legalEntity");
    await safeRun(() => this.validateDropdown("payGroup"), "payGroup");
    await safeRun(() => this.validateField("ctc"), "ctc");
    await safeRun(() => this.validateDropdown("taxRegime"), "taxRegime");

    // ── Payroll checkboxes ────────────────────────────────────
    await safeRun(
      () => this.validateCheckbox("providentFundEligible"),
      "providentFundEligible",
    );
    await safeRun(() => this.validateCheckbox("esiEligible"), "esiEligible");
    await safeRun(() => this.validateCheckbox("lwfEligible"), "lwfEligible");

    // ── Bonuses (dynamic) ─────────────────────────────────────
    const bonusCount = this.ctx.getFinal("bonusCount") || 0;
    const rawBonuses = this.ctx.getFinal("bonuses") || [];

    for (let i = 0; i < bonusCount; i++) {
      await safeRun(
        () => this.validateBonusCard(i, rawBonuses[i]),
        `bonus_${i}`,
      );
    }
    // // ── Static fields ─────────────────────────────────────────
    // await safeRun(() => this.validateDropdown("legalEntity"));
    // await safeRun(() => this.validateDropdown("payGroup"));
    // await safeRun(() => this.validateField("ctc"));
    // await safeRun(() => this.validateDropdown("taxRegime"));

    // // ── Payroll checkboxes ────────────────────────────────────
    // await safeRun(() => this.validateCheckbox("providentFundEligible"));
    // await safeRun(() => this.validateCheckbox("esiEligible"));
    // await safeRun(() => this.validateCheckbox("lwfEligible"));

    // // ── Bonuses (dynamic) ─────────────────────────────────────
    // const bonusCount = this.ctx.getFinal("bonusCount") || 0;
    // for (let i = 0; i < bonusCount; i++) {
    //   await safeRun(() => this.validateDropdown(`bonus_${i}_bonusName`));
    //   await safeRun(() => this.validateField(`bonus_${i}_value`));
    //   await safeRun(() => this.validateField(`bonus_${i}_percentage`));
    //   await safeRun(() => this.validateField(`bonus_${i}_payoutMonth`));
    //   await safeRun(() => this.validateField(`bonus_${i}_note`));
    // }
  }
  async validateBonusCard(index, bonusData) {
    try {
      const page = this.form.page;

      // DEBUG
      console.log(
        `validateBonusCard[${index}] bonusData:`,
        JSON.stringify(bonusData),
      );

      const bonusCard = page.locator(".border.mt-3.p-3.rounded").nth(index);
      const cardText = (await bonusCard.innerText()).trim();

      // DEBUG
      console.log(`validateBonusCard[${index}] cardText:`, cardText);

      this.ctx.log(`bonus_${index} card text: "${cardText}"`, "info");

      // check bonus name appears somewhere in the card
      if (bonusData?.bonusName) {
        if (
          cardText.toLowerCase().includes(bonusData.bonusName.toLowerCase())
        ) {
          this.ctx.log(
            `bonus_${index}: bonusName "${bonusData.bonusName}" found in card`,
            "info",
          );
        } else {
          this._recordMismatch(
            `bonus_${index}_bonusName`,
            bonusData.bonusName,
            "not visible in saved card",
          );
        }
      }

      // check value/percentage
      if (bonusData?.bonusType === "percentage") {
        // UI shows: (ctc * percentage / 100) / 12
        const ctc = Number(
          this.ctx.final?.ctc || this.ctx.input?.finance?.ctc || 0,
        );
        const pct = Number(bonusData.percentage);
        const expectedMonthly = Math.round((ctc * pct) / 100);

        console.log(
          `bonus_${index}: ctc=${ctc} pct=${pct} expectedMonthly=${expectedMonthly}`,
        );

        if (cardText.replace(/,/g, "").includes(String(expectedMonthly))) {
          this.ctx.log(
            `bonus_${index}: monthly amount "${expectedMonthly}" found in card`,
            "info",
          );
        } else {
          this._recordMismatch(
            `bonus_${index}_percentage`,
            String(expectedMonthly),
            "not visible in saved card",
          );
        }
      } else if (bonusData?.bonusType === "value") {
        // UI shows: value / 12
        const expectedMonthly = Math.round(Number(bonusData.value));

        console.log(
          `bonus_${index}: value=${bonusData.value} expectedMonthly=${expectedMonthly}`,
        );

        if (cardText.replace(/,/g, "").includes(String(expectedMonthly))) {
          this.ctx.log(
            `bonus_${index}: monthly amount "${expectedMonthly}" found in card`,
            "info",
          );
        } else {
          this._recordMismatch(
            `bonus_${index}_value`,
            String(expectedMonthly),
            "not visible in saved card",
          );
        }
      } else {
        this.ctx.log(
          `bonus_${index}: no bonusType set — skipping amount check`,
          "warn",
        );
      }
    } catch (err) {
      this.ctx.log(`validateBonusCard[${index}]: ${err.message}`, "error");
      throw new Error(`validateBonusCard ${index} failed: ${err.message}`);
    }
  }
}

module.exports = { StepFinancialDetails };
