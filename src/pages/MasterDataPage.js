const { TableScraper } = require("../utils/TableScraperMasterTable");

class MasterDataPage {
  constructor(page) {
    this.page = page;
    this.scraper = new TableScraper(page);

    // These keys are what compare() uses — they must match fieldMap below.
    this.columns = [
      // "employeeId",
      "Employee Name",
      "Department",
      "Designation",
      "Grade",
      "Band",
      "Legal Entity",
      "Business Unit",
      "Personal Contact Number",
      "Official Contact Number",
      "Official Email",
      "Personal Email",
      "Date of Birth (DOB)",
      "Date of Joining (DOJ)",
      "Gender",
      "Marital Status",
      "Location",
      "Tenure at CollectivWork",
      "Reporting Manager",
      "Reporting HR",
      "L2 Manager",
      "Associate Manager",
      "Blood Group",
      "Employment Status",
      "Employment Type",
      "Employee Status",
      "Work Mode",
      "Current Address",
      "Permanent Address",
      "Emergency Contact Name",
      "Emergency Contact Relationship",
      "Emergency Contact Number",
      "Notice Period",
      "Aadhaar Number",
      "PAN Number",
      "Skill",
      "Onboarding Policy",
      "Role Phase Duration",
      "Shift Policy",
      "Shift Timing",
      "Attendance Policy",
      "Leave Policy",
      "Reimbursement Policy",
      "Offboarding Policy",
      "Onboarding Email Status",
      "Login Status",
      "Account Status",
    ];
  }

  // ── goto ─────────────────────────────────────────────────────
  // EDIT: update route and tab name to match your app.
  async goto() {
    try {
      // await this.page.goto("/employee-management");
      await this.page.goto("/employee-management", {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // await this.page.keyboard.press("Escape");
      // await this.page.keyboard.press("Escape");
      const tab = this.page.getByRole("tab", { name: "Employee Analytics" });
      await tab.waitFor({ state: "visible", timeout: 10000 });
      await tab.click();

      const heading = this.page.getByRole("heading", {
        name: "All Employees Master Data",
      });
      for (let i = 0; i < 10; i++) {
        if (await heading.count()) break;
        await this.page.mouse.wheel(0, 1200);
        await this.page.waitForTimeout(200);
      }
      await heading.waitFor({ state: "visible" });
      // const section = heading.locator(
      //   'xpath=ancestor::div[contains(@class,"dashboardDetailTable")][1]',
      // );
      // const filterButton = section
      //   .locator('[aria-label="filter"]')
      //   .first()
      //   .locator("xpath=ancestor::div[1]");

      // await filterButton.click();
    } catch (err) {
      throw new Error(`MasterDataPage.goto() failed: ${err.message}`);
    }
  }

  // async filterAndScrape(employeeId) {
  //   try {
  //     return await this.scraper.filterAndScrape(employeeId, this.columns);
  //   } catch (err) {
  //     throw new Error(
  //       `MasterDataPage.filterAndScrape(${employeeId}) failed: ${err.message}`,
  //     );
  //   }
  // }
  async filterAndScrape(employeeName) {
    try {
      return await this.scraper.filterAndScrape(employeeName, this.columns);
    } catch (err) {
      throw new Error(
        `MasterDataPage.filterAndScrape(${employeeName}) failed: ${err.message}`,
      );
    }
  }

  // ── compare ───────────────────────────────────────────────────
  // Diffs scraped row data against what was submitted in the form.
  // EDIT: update fieldMap keys and ctx paths to match your columns.
  compare(scraped, ctx) {
    const mismatches = [];

    // Normalize date: "1998-03-15" ↔ "15 Mar 1998"
    const normalizeDate = (val) => {
      if (!val) return "";
      const d = new Date(val);
      if (isNaN(d)) return val.trim().toLowerCase();
      return d
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, " "); // "15 Mar 1998"
    };

    // Normalize name: strip employee ID and initials prefix
    // "AS Aisha Priya Sharma" → "aisha priya sharma"
    // const normalizeName = (val) => {
    //   if (!val) return "";
    //   // Remove leading initials like "AS "
    //   return val
    //     .replace(/^[A-Z]{1,4}\s/, "")
    //     .trim()
    //     .toLowerCase();
    // };
    const normalizeName = (val) => {
      if (!val) return "";
      // 1. Strip leading initials "AS Aisha Priya Sharma" → "Aisha Priya Sharma"
      const stripped = val.replace(/^[A-Z]{1,4}\s+/, "").trim();
      // 2. Keep only first and last word "Aisha Priya Sharma" → "Aisha Sharma"
      const parts = stripped.split(/\s+/);
      if (parts.length > 2) {
        return `${parts[0]} ${parts[parts.length - 1]}`.toLowerCase();
      }
      return stripped.toLowerCase();
    };

    // Normalize grade/band: "G1 (G1)" → "g1", "entry (B1)" → "entry"
    const normalizeGradeBand = (val) => {
      if (!val) return "";
      return val
        .replace(/\s*\(.*?\)/, "")
        .trim()
        .toLowerCase();
    };

    // Normalize manager: strip ID part "Kamal Pandey (COL-0119)" → "kamal pandey"
    const normalizeManager = (val) => {
      if (!val) return "";
      return val
        .replace(/\s*\(.*?\)/, "")
        .trim()
        .toLowerCase();
    };

    // Map: { column key from this.columns : fn returning expected value }
    // EDIT: add/remove entries to match your actual table columns.
    const fieldMap = {
      "Employee Name": () =>
        `${ctx.final.firstName} ${ctx.final.lastName}`.trim(),

      Department: () => ctx.final.department,
      Designation: () => ctx.final.designation,
      Grade: () => ctx.final.grade,
      Band: () => ctx.final.band,
      "Legal Entity": () => ctx.final.legalEntity,
      "Business Unit": () => ctx.final.businessUnit,
      "Official Email": () => ctx.final.workEmail,
      "Date of Birth (DOB)": () => ctx.final.dob,
      "Date of Joining (DOJ)": () => ctx.final.joiningDate,
      Gender: () => ctx.input.personal.gender,
      "Marital Status": () => ctx.input.personal.maritalStatus,
      Location: () => ctx.final.location,
      "Reporting Manager": () => ctx.final.reportingManager,
      "Reporting HR": () => ctx.final.hrManager,
      "L2 Manager": () => ctx.final.l2Manager,
      "Employment Status": () => ctx.final.employmentStatus,
      "Employment Type": () => ctx.final.employmentType,
      "Work Mode": () => ctx.final.workMode,
      "Onboarding Policy": () => ctx.final.onboardingPolicy,
      "Shift Policy": () => ctx.final.shiftPolicy,
      "Attendance Policy": () => ctx.final.attendancePolicy,
      "Leave Policy": () => ctx.final.leavePolicy,
      "Reimbursement Policy": () => ctx.final.reimbursementPolicy,
      "Offboarding Policy": () => ctx.final.offboardingPolicy,
    };

    // for (const [col, getExpected] of Object.entries(fieldMap)) {
    //   const expected = getExpected();
    //   const actual = scraped[col];

    //   if (!expected) continue; // skip fields not submitted

    //   if (actual === undefined || actual === null || actual === "") {
    //     mismatches.push({
    //       field: col,
    //       expected,
    //       actual: "NOT FOUND IN ROW",
    //       source: "MasterDataPage",
    //     });
    //   } else if (
    //     actual.trim().toLowerCase() !== String(expected).trim().toLowerCase()
    //   ) {
    //     mismatches.push({
    //       field: col,
    //       expected,
    //       actual,
    //       source: "MasterDataPage",
    //     });
    //   }
    // }

    const dateFields = new Set([
      "Date of Birth (DOB)",
      "Date of Joining (DOJ)",
    ]);
    const nameFields = new Set(["Employee Name"]);
    const gradeBandFields = new Set(["Grade", "Band"]);
    const managerFields = new Set([
      "Reporting Manager",
      "Reporting HR",
      "L2 Manager",
    ]);

    for (const [col, getExpected] of Object.entries(fieldMap)) {
      const expected = getExpected();
      const actual = scraped[col];

      if (!expected) continue;

      if (actual === undefined || actual === null || actual === "") {
        mismatches.push({
          field: col,
          expected,
          actual: "NOT FOUND IN ROW",
          source: "MasterDataPage",
        });
        continue;
      }

      let actualNorm, expectedNorm;

      if (dateFields.has(col)) {
        actualNorm = actual.trim().toLowerCase();
        expectedNorm = normalizeDate(expected).toLowerCase();
      } else if (nameFields.has(col)) {
        actualNorm = normalizeName(actual);
        expectedNorm = expected.trim().toLowerCase();
      } else if (gradeBandFields.has(col)) {
        actualNorm = normalizeGradeBand(actual);
        expectedNorm = expected.trim().toLowerCase();
      } else if (managerFields.has(col)) {
        actualNorm = normalizeManager(actual);
        expectedNorm = normalizeManager(expected);
      } else {
        actualNorm = actual.trim().toLowerCase();
        expectedNorm = String(expected).trim().toLowerCase();
      }

      if (actualNorm !== expectedNorm) {
        mismatches.push({
          field: col,
          expected,
          actual,
          source: "MasterDataPage",
        });
      }
    }

    return mismatches;
  }
}

module.exports = { MasterDataPage };
