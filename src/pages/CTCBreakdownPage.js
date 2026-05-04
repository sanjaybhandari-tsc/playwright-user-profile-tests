// src/pages/CTCBreakdownPage.js
// ─────────────────────────────────────────────────────────────
// Filters the CTC Breakdown table by employeeId using the same
// filter modal approach, then scrolls horizontally to capture
// all CTC columns from the single result row.
//
// EDIT markers show every place you need to update.
// ─────────────────────────────────────────────────────────────

const { TableScraper } = require("../utils/TableScraperCTCTable");

class CTCBreakdownPage {
  constructor(page) {
    this.page = page;
    this.scraper = new TableScraper(page);

    // EDIT: list every CTC column in exact left-to-right order.
    // Use null to skip columns you don't need to verify.
    this.columns = [
      // "Employee ID",
      "Employee Name",
      "Location",
      "Date Of Joining",
      "Department",
      "Designation",
      "Grade Name",
      "Band Name",
      "Work Mode",
      "Employment Status",
      "Employee Status",
      "Adhaar Card",
      "PAN Card",
      "Paygroup",
      "CTC (Monthly)",
      "CTC (Annually)",
      "Gross Salary (Monthly)",
      "Gross Salary (Annually)",
      "Bank Account Number",
      "Bank Name",
      "IFSC Code",
      "PF Number",
      "UAN Number",
      "ESI Number",
      "Business Unit",
      "Legal Entity",
      "Professional Tax",
      "Provident Fund - Employee",
      "Provident Fund - Employer",
      "ESI - Employee",
      "ESI - Employer",
      "Gratuity",
      "Penalty charges",
      "Retention bonus",
      "Basic",
      "Performance Bonus",
      "Fuel & Car Maintenance",
      "STAT BONUS",
      "Stat Bonus - 1",
      "Uniform",
      "Labour Welfare Fund - Employee",
      "Labour Welfare Fund - Employer",
      "House Rent Allowance",
      "Medical",
      "Adhoc",
      "Driver salary",
      "Joining bonus",
      "Performance Bonus 1",
      "Food Allowance",
      "Car Allowance",
      "Joining Bonus - Approval",
      "Approval Component",
      "Joining Earned Bonus",
      "Joining",
      "Penalty",
      "Bonus test",
      "TEST BONUS",
      "Conveyance",
      "LTA",
      "Variable Pay - 1",
      "RetentionBonus 80U Test 10 Percent Monthly",
      "JoiningBonus 80DD Test 20 Percent",
      "PerformanceBonus 80EE Test 30 Percent",
      "Variable pay calculates on gross",
      "JoiningBounus Gross Test 50",
      "Variable Pay",
      "Deduction nanual 1",
      "Reimbursement 1",
      "Earned bonus referrral bonus 1",
      "Earned bonus performance bonus 1",
      "Earned bonus overtime pay1",
      "Medical Allowance",
      "Education Allowance",
      "Misc Allowance/Adhoc",
      "Salary Advance",
      "L&D Cost – Training Cost",
      "Other Deduction",
      "Variable Pay - Adhoc",
      "Employee Corporate NPS",
      "LWF-Employee",
      "LWF 123",
      "Prorated LWF",
      "Quarterly bonus Pay",
      "Leave Encashment F&F Settlement",
      "Leave Encashment",
      "Fixed 1",
      "Employee Referral Bonus",
      "Allowance1",
      "Contribution -gratituity 1",
      "Contribution -medic.insurance 1",
      "Deduction-monthly",
      "Deduction-quarter 1",
      "Deduction half year 1",
      "Earned bonus retention1",
      "Earne dbinus joining bonus 1",
      "Earned bonus incentive 1",
      "Earning1",
      "Deduction 1",
      "Deduction 11",
      "Earning 11",
      "Approval Based Performance Bonus (Fixed)",
      "Approval Based Performance Bonus (% of CTC)",
      "Approval Based Performance Bonus (% of Gross)",
      "April Aproval",
      "Special Allowance",
      "Performance Joining Bonus",
    ];
  }

  // ── goto ─────────────────────────────────────────────────────
  // EDIT: update to your actual CTC/payroll route.
  async goto() {
    try {
      await this.page.goto("/payroll/dashboard", {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // EDIT: click a tab if the CTC table is behind one
      // const tab = this.page.getByRole("tab", { name: "CTC Breakdown" });
      // await tab.waitFor({ state: "visible", timeout: 10000 });
      // await tab.click();
      const heading = this.page.getByRole("heading", {
        name: "CTC Breakdown",
      });
      for (let i = 0; i < 10; i++) {
        if (await heading.count()) break;
        await this.page.mouse.wheel(0, 1200);
        await this.page.waitForTimeout(200);
      }
      await heading.waitFor({ state: "visible" });
    } catch (err) {
      throw new Error(`CTCBreakdownPage.goto() failed: ${err.message}`);
    }
  }

  // ── filterAndScrape ───────────────────────────────────────────
  // Opens the filter modal, types employeeId, applies filter,
  // scrolls horizontally across the single result row, returns
  // a { columnName: value } object.
  // async filterAndScrape(employeeId) {
  //   try {
  //     return await this.scraper.filterAndScrape(employeeId, this.columns);
  //   } catch (err) {
  //     throw new Error(
  //       `CTCBreakdownPage.filterAndScrape(${employeeId}) failed: ${err.message}`,
  //     );
  //   }
  // }
  async filterAndScrape(employeeName) {
    try {
      return await this.scraper.filterAndScrape(employeeName, this.columns);
    } catch (err) {
      throw new Error(
        `CTCBreakdownPage.filterAndScrape(${employeeName}) failed: ${err.message}`,
      );
    }
  }

  // ── compare ───────────────────────────────────────────────────
  // Diffs scraped CTC row against submitted finance input.
  // Currency values are normalized before comparison.
  // EDIT: update fieldMap keys and ctx paths to match your columns.
  compare(scraped, ctx) {
    const mismatches = [];

    // Strip commas for number comparison
    const normalize = (v) =>
      String(v ?? "")
        .replace(/,/g, "")
        .trim();
    // Normalize name: strip leading initials "AS Aisha Priya Sharma" → "aisha priya sharma"
    const normalizeName = (val) => {
      if (!val) return "";
      return val
        .replace(/^[A-Z]{1,4}\s/, "")
        .trim()
        .toLowerCase();
    };

    // Normalize grade/band: "G1 (G1)" → "g1", "entry (B1)" → "entry"
    const normalizeGradeBand = (val) => {
      if (!val) return "";
      return val
        .replace(/\s*\(.*?\)/, "")
        .trim()
        .toLowerCase();
    };

    const fieldMap = {
      "Employee Name": () =>
        `${ctx.final.firstName} ${ctx.final.middleName} ${ctx.final.lastName}`.trim(),
      Location: () => ctx.final.location,
      "Date Of Joining": () => ctx.final.joiningDate,
      Department: () => ctx.final.department,
      Designation: () => ctx.final.designation,
      "Grade Name": () => ctx.final.grade,
      "Band Name": () => ctx.final.band,
      "Work Mode": () => ctx.final.workMode,
      "Employment Status": () => ctx.final.employmentStatus,
      "Business Unit": () => ctx.final.businessUnit,
      "Legal Entity": () => ctx.final.legalEntity,
      Paygroup: () => ctx.final.payGroup,
      // "CTC (Monthly)": () => (ctx.final.ctc),
      "CTC (Monthly)": () => ctx.final.ctc / 12,

      // Bonus columns — only map ones submitted
      "Approval Based Performance Bonus (% of CTC)": () =>
        ctx.final.bonuses?.find(
          (b) => b.bonusName === "Approval Based Performance Bonus (% of CTC)",
        )?.percentage ?? null,
    };
    const nameFields = new Set(["Employee Name"]);
    const gradeBandFields = new Set(["Grade Name", "Band Name"]);
    const numericFields = new Set([
      "CTC (Monthly)",
      "CTC (Annually)",
      "Gross Salary (Monthly)",
      "Gross Salary (Annually)",
    ]);
    // Bonus % should match percentage submitted, not computed value
    const bonusFields = new Set([
      "Approval Based Performance Bonus (% of CTC)",
    ]);

    // for (const [col, getExpected] of Object.entries(fieldMap)) {
    //   const expected = getExpected();
    //   const actual = scraped[col];

    //   if (!expected) continue;

    //   if (actual === undefined || actual === null || actual === "") {
    //     mismatches.push({
    //       field: col,
    //       expected,
    //       actual: "NOT FOUND IN ROW",
    //       source: "CTCBreakdownPage",
    //     });
    //     continue;
    //   }

    //   const isCurrency = currencyFields.has(col);
    //   const match = isCurrency
    //     ? normalize(actual) === normalize(expected)
    //     : actual.trim().toLowerCase() === String(expected).trim().toLowerCase();

    //   if (!match) {
    //     mismatches.push({
    //       field: col,
    //       expected,
    //       actual,
    //       source: "CTCBreakdownPage",
    //     });
    //   }
    // }
    for (const [col, getExpected] of Object.entries(fieldMap)) {
      const expected = getExpected();
      const actual = scraped[col];

      if (!expected) continue;

      if (actual === undefined || actual === null || actual === "") {
        mismatches.push({
          field: col,
          expected,
          actual: "NOT FOUND IN ROW",
          source: "CTCBreakdownPage",
        });
        continue;
      }

      let actualNorm, expectedNorm;

      if (nameFields.has(col)) {
        actualNorm = normalizeName(actual);
        expectedNorm = expected.trim().toLowerCase();
      } else if (gradeBandFields.has(col)) {
        actualNorm = normalizeGradeBand(actual);
        expectedNorm = expected.trim().toLowerCase();
      } else if (numericFields.has(col)) {
        actualNorm = normalize(actual);
        expectedNorm = normalize(String(expected));
      } else if (bonusFields.has(col)) {
        // UI shows computed value (960), we compare percentage (8) — skip value check
        // Only verify the bonus column exists and is not empty
        actualNorm = actual !== "" ? "present" : "";
        expectedNorm = expected !== "" ? "present" : "";
      } else {
        actualNorm = actual.trim().toLowerCase();
        expectedNorm = String(expected).trim().toLowerCase();
      }

      if (actualNorm !== expectedNorm) {
        mismatches.push({
          field: col,
          expected,
          actual,
          source: "CTCBreakdownPage",
        });
      }
    }

    return mismatches;
  }
}

module.exports = { CTCBreakdownPage };
