
const { test, expect } = require("@playwright/test");
const { CTCBreakdownPage } = require("../src/pages/CTCBreakdownPage");

// ── EDIT: paste a real employeeId that already exists in the app
const TEST_EMPLOYEE_ID = "Sanjay (COL-0139)";


const EXPECTED = {
  // "Employee ID": "COL-0139",
  "Employee Name": "Sanjay",
  "Location": "Dehradun",
  "Date Of Joining": "2026-02-17",
  "Department": "IT Department",
  "Designation": "",
  "Grade Name": "",
  "Band Name": "",
  "Work Mode": "On-site",
  "Employment Status": "PERMANENT",
  "Employee Status": "Serving Notice Period",
  "Adhaar Card": "789456123741",
  "PAN Card": "",
  "Paygroup": "FBP Paygroup- halfyearly",
  "CTC (Monthly)": "2000000.08",
  "CTC (Annually)": "24000001",
  "Gross Salary (Monthly)": "",
  "Gross Salary (Annually)": "",
  "Bank Account Number": "",
  "Bank Name": "",
  "IFSC Code": "",
  "PF Number": "",
  "UAN Number": "",
  "ESI Number": "",
  "Business Unit": "",
  "Legal Entity": "Legal Entity-14",
  "Professional Tax": "",
  "Provident Fund - Employee": "1358487",
  "Provident Fund - Employer": "1358487",
  "ESI - Employee": "34",
  "ESI - Employer": "68",

  // Everything below not provided → empty
  "Gratuity": "",
  "Penalty charges": "",
  "Retention bonus": "",
  "Basic": "",
  "Performance Bonus": "",
  "Fuel & Car Maintenance": "",
  "STAT BONUS": "",
  "Stat Bonus - 1": "",
  "Uniform": "",
  "Labour Welfare Fund - Employee": "",
  "Labour Welfare Fund - Employer": "",
  "House Rent Allowance": "",
  "Medical": "",
  "Adhoc": "",
  "Driver salary": "",
  "Joining bonus": "",
  "Performance Bonus 1": "",
  "Food Allowance": "",
  "Car Allowance": "",
  "Joining Bonus - Approval": "",
  "Approval Component": "",
  "Joining Earned Bonus": "",
  "Joining": "",
  "Penalty": "",
  "Bonus test": "",
  "TEST BONUS": "",
  "Conveyance": "",
  "LTA": "",
  "Variable Pay - 1": "",
  "RetentionBonus 80U Test 10 Percent Monthly": "",
  "JoiningBonus 80DD Test 20 Percent": "",
  "PerformanceBonus 80EE Test 30 Percent": "",
  "Variable pay calculates on gross": "",
  "JoiningBounus Gross Test 50": "",
  "Variable Pay": "",
  "Deduction nanual 1": "",
  "Reimbursement 1": "",
  "Earned bonus referrral bonus 1": "",
  "Earned bonus performance bonus 1": "",
  "Earned bonus overtime pay1": "",
  "Medical Allowance": "",
  "Education Allowance": "",
  "Misc Allowance/Adhoc": "",
  "Salary Advance": "",
  "L&D Cost – Training Cost": "",
  "Other Deduction": "",
  "Variable Pay - Adhoc": "",
  "Employee Corporate NPS": "",
  "LWF-Employee": "",
  "LWF 123": "",
  "Prorated LWF": "",
  "Quarterly bonus Pay": "",
  "Leave Encashment F&F Settlement": "",
  "Leave Encashment": "",
  "Fixed 1": "",
  "Employee Referral Bonus": "",
  "Allowance1": "",
  "Contribution -gratituity 1": "",
  "Contribution -medic.insurance 1": "",
  "Deduction-monthly": "",
  "Deduction-quarter 1": "",
  "Deduction half year 1": "",
  "Earned bonus retention1": "",
  "Earne dbinus joining bonus 1": "",
  "Earned bonus incentive 1": "",
  "Earning1": "",
  "Deduction 1": "",
  "Deduction 11": "",
  "Earning 11": "",
  "Approval Based Performance Bonus (Fixed)": "",
  "Approval Based Performance Bonus (% of CTC)": "",
  "Approval Based Performance Bonus (% of Gross)": "",
  "April Aproval": "",
  "Special Allowance": "",
  "Performance Joining Bonus": ""
};

test("DEV — scrape CTC breakdown for existing employee", async ({ page }) => {
  test.setTimeout(60000);

  const ctcPage = new CTCBreakdownPage(page);
  let scraped = {};

  await test.step("Navigate to CTC Breakdown page", async () => {
    await ctcPage.goto();
  });

  await test.step(`Filter by employeeId: ${TEST_EMPLOYEE_ID}`, async () => {
    scraped = await ctcPage.filterAndScrape(TEST_EMPLOYEE_ID);
    console.log("Scraped row:", scraped);
  });

  await test.step("Assert scraped values match expected", async () => {
    // Currency fields — strip ₹, $, commas before comparing
    const currencyFields = new Set([
      "basicSalary", "hra", "allowances", "pf", "totalCtc", "bonus", "gratuity",
    ]);
    const normalize = (v) => String(v ?? "").replace(/[₹$,\s]/g, "").trim();

    for (const [field, expected] of Object.entries(EXPECTED)) {
      if (expected === null || expected === undefined) continue; // skip

      const actual = scraped[field];
      console.log(`[${field}] expected="${expected}" actual="${actual}"`);

      const isCurrency = currencyFields.has(field);
      const actualNorm   = isCurrency ? normalize(actual)   : actual?.trim().toLowerCase();
      const expectedNorm = isCurrency ? normalize(expected)  : String(expected).trim().toLowerCase();

      expect.soft(
        actualNorm,
        `[${field}] mismatch — expected "${expected}" got "${actual}"`,
      ).toBe(expectedNorm);
    }
  });
});
