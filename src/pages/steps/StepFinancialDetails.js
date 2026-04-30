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
    const data = { ...fallbackRegistry.financeDetails };
    for (const [key, val] of Object.entries(rawData || {})) {
      if (val !== null && val !== undefined && val !== "") {
        data[key] = val;
      }
    }
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
        } else {
          this.ctx.log(`bonus_${i}: percentage field detected`, "info");
          await this.form.fill(`bonus_${i}_percentage`, bonusData.percentage);
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

  async fillMonth(fieldKey, value) {
    if (!value) return;

    const { selector, group } = this.fields[fieldKey]; //  resolve
    const page = this.form.page; //  single source, remove this.form?.page || this.page
    const input = page.locator(selector);

    await input.click();
    await input.fill(String(value)); //  use value not date (date is undefined)
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
    await safeRun(() => this.validateCheckbox("providentFundEligible"), "providentFundEligible");
    await safeRun(() => this.validateCheckbox("esiEligible"), "esiEligible");
    await safeRun(() => this.validateCheckbox("lwfEligible"), "lwfEligible");

    // ── Bonuses (dynamic) ─────────────────────────────────────
    const bonusCount = this.ctx.getFinal("bonusCount") || 0;
  const rawBonuses = this.ctx.getFinal("bonuses") || [];

  for (let i = 0; i < bonusCount; i++) {
    await safeRun(
      () => this.validateBonusCard(i, rawBonuses[i]),
      `bonus_${i}`
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

    // after save, bonus card shows data as text — not inside ant-select
    const bonusCard = page.locator(".border.mt-3.p-3.rounded").nth(index);

    const cardText = (await bonusCard.innerText()).trim();
    this.ctx.log(`bonus_${index} card text: "${cardText}"`, "info");

    // check bonus name appears somewhere in the card
    if (bonusData?.bonusName) {
      if (cardText.toLowerCase().includes(bonusData.bonusName.toLowerCase())) {
        this.ctx.log(`bonus_${index}: bonusName "${bonusData.bonusName}" found in card`, "info");
      } else {
        this._recordMismatch(
          `bonus_${index}_bonusName`,
          bonusData.bonusName,
          "not visible in saved card"
        );
      }
    }

    // check value/percentage
    const amount = bonusData?.value || bonusData?.percentage;
    if (amount) {
      if (cardText.includes(String(amount))) {
        this.ctx.log(`bonus_${index}: amount "${amount}" found in card`, "info");
      } else {
        this._recordMismatch(
          `bonus_${index}_value`,
          String(amount),
          "not visible in saved card"
        );
      }
    }

  } catch (err) {
    this.ctx.log(`validateBonusCard[${index}]: ${err.message}`, "error");
    throw new Error(`validateBonusCard ${index} failed: ${err.message}`);
  }
}
}

module.exports = { StepFinancialDetails };
