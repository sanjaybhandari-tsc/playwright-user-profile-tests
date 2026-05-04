

const { test, expect } = require("@playwright/test");
const { MasterDataPage } = require("../src/pages/MasterDataPage");

// ── EDIT: paste a real employeeId that already exists in the app
const TEST_EMPLOYEE_ID = "Sanjay (Col-0139)";

// ── EDIT: what you expect to see in the table for this employee
// Leave a field as null to skip its assertion.

// employeeId: "Sanjay (Col-0139)",
const EXPECTED = {
  // "Employee Name": "Sanjay",
  "Department": "IT Department",
  "Designation": "",
  "Grade": "",
  "Band": "",
  "Legal Entity": "Legal Entity-14",
  "Business Unit": "",
  "Personal Contact Number": "+917654323456",
  "Official Contact Number": "",
  "Official Email": "sanjay.bhandari@techsuperiors.com",
  "Personal Email": "",
  "Date of Birth (DOB)": "11 Mar 2007",
  "Date of Joining (DOJ)": "17 Feb 2026",
  "Gender": "Male",
  "Marital Status": "Unmarried",
  "Location": "Dehradun",
  "Tenure at CollectivWork": "2 months 13 days",
  "Reporting Manager": "Tanishq",
  "Reporting HR": "",
  "L2 Manager": "Ayush Singh",
  "Associate Manager": "",
  "Blood Group": "",
  "Employment Status": "Permanent",
  "Employment Type": "Full Time",
  "Employee Status": "Serving Notice Period",
  "Work Mode": "On-site",
  "Current Address": "",
  "Permanent Address": "",
  "Emergency Contact Name": "",
  "Emergency Contact Relationship": "",
  "Emergency Contact Number": "",
  "Notice Period": "15 day(s)",
  "Aadhaar Number": "789456123741",
  "PAN Number": "",
  "Skill": "",
  "Onboarding Policy": "Onboarding new Policy",
  "Role Phase Duration": "",
  "Shift Policy": "shift+-",
  "Shift Timing": "3:00 PM to 3:15 PM",
  "Attendance Policy": "Testing Name Requester",
  "Leave Policy": "Leave Request WFH",
  "Reimbursement Policy": "",
  "Offboarding Policy": "TS Offboarding Policy-01",
  "Onboarding Email Status": "sent",
  "Login Status": "Enabled",
  "Account Status": "Invited"
};

test("DEV — scrape master data for existing employee", async ({ page }) => {
  test.setTimeout(60000);

  const masterPage = new MasterDataPage(page);
  let scraped = {};

  await test.step("Navigate to Employee List", async () => {
    await masterPage.goto();
  });

  await test.step(`Filter by employeeId: ${TEST_EMPLOYEE_ID}`, async () => {
    scraped = await masterPage.filterAndScrape(TEST_EMPLOYEE_ID);
    console.log("Scraped row:", scraped);
  });

  await test.step("Assert scraped values match expected", async () => {
    for (const [field, expected] of Object.entries(EXPECTED)) {
      if (expected === null || expected === undefined) continue; // skip

      const actual = scraped[field];

      console.log(`[${field}] expected="${expected}" actual="${actual}"`);

      expect.soft(
        actual?.trim().toLowerCase(),
        `[${field}] mismatch — expected "${expected}" got "${actual}"`,
      ).toBe(String(expected).trim().toLowerCase());
    }
  });
});
