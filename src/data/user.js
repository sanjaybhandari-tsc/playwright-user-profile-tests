const user = {
  personalDetails: {
    firstName: "Rohan",
    middleName: "Pratap",
    lastName: "Negi",
    dateOfBirth: "1997-11-22",
    gender: "Male", // options: ["Male", "Female", "Other"]
    maritalStatus: "Unmarried", // options: ["Married", "Unmarried"]
    phone: "1234567890",
    employeeSeries: "ES-105",
    // employeeSeries: "Tech Superior (TS-EMP001)",
    joiningDate: "2025-04-24", // should be past date (<= current date)
    skills: ["JavaScript", "React", "SQL"],
  },

  workDetails: {
    workEmail: "rohan.negi@company.com",
    location: "Dehradun", // options: ["Dehradun", "Gurgaon"]
    role: "Software Engineer", // dropdown options only
    employmentStatus: "Permanent", // ["Permanent", "Intern", "Contract", "Consultant"]
    employmentType: "Full Time", // ["Full Time", "Part Time"]
    workMode: "Hybrid", // ["Remote", "Hybrid", "Onsite"]
    businessUnit: "Engineering", // options list driven
    holidayPlan: "Standard Plan", // dropdown options only
    department: "IT Department",
    designation: "SDE-1", // options list
    grade: "G4", // options list
    band: "B2", // options list
    reportingManager: "Amit Sharma", // dropdown/user search select
    hrManager: "Neha Verma",
    l2Manager: "Vikram Singh",
    // associateManager: ["Pooja Rawat", "Karan Mehta"], // multi-select from available list
    associateManager: ["Sankalp (COL-0057)"], // multi-select from available list
    protectDocumentRestrictedAccess: true, // boolean checkbox
  },

  policySetting: {
    isProbationDurationApplicable: true,
    // onboardingPolicy: "Standard Onboarding", // or "Fast Track Onboarding" / "Manual Onboarding"
    onboardingPolicy: "April Policy", // or "Fast Track Onboarding" / "Manual Onboarding"
    // shiftPolicy: "General Shift (9AM - 6PM)", // or "Night Shift", "Rotational Shift"
    shiftPolicy: "Half Weekend", // or "Night Shift", "Rotational Shift"
    // attendancePolicy: "Biometric Mandatory", // or "Mobile Check-in", "Web Check-in"
    attendancePolicy: "Work From Home Policy", // or "Mobile Check-in", "Web Check-in"
    // leavePolicy: "Annual Leave Policy", // or "Casual Leave Policy", "Flexible Leave Policy"
    leavePolicy: "Default Leave Policy", // or "Casual Leave Policy", "Flexible Leave Policy"
    // reimbursementPolicy: "Monthly Reimbursement Cycle", // or "Quarterly Reimbursement Cycle"
    reimbursementPolicy: "Expense Policy 1", // or "Quarterly Reimbursement Cycle"
    // offboardingPolicy: "Standard Exit Process", // or "Fast Exit Process"
    offboardingPolicy: "New Offboarding Policy", // or "Fast Exit Process"
    // overtimePolicy: "Approved Only", // or "Auto Approved", "Manager Approval Required"
    overtimePolicy: "Overtime Policy", // or "Auto Approved", "Manager Approval Required"
  },

  uploadDocument: {
    employeeAgreements: [
      {
        fileName: "agreement.pdf",
        filePath: "test-data/files/agreement.pdf",
      },
    ],

    miscellaneous: [],

    education: [
      { fileName: "degree.pdf", filePath: "test-data/files/degree.pdf" },
    ],

    previousEmployment: [
      {
        fileName: "experience.pdf",
        filePath: "test-data/files/experience.pdf",
      },
    ],

    onboarding: [
      {
        fileName: "onboarding.pdf",
        filePath: "test-data/files/onboarding.pdf",
      },
    ],

    incomeTax: [{ fileName: "pan.pdf", filePath: "test-data/files/pan.pdf" }],

    identity: [
      { fileName: "aadhar.pdf", filePath: "test-data/files/aadhar.pdf" },
      {
        fileName: "passport.pdf",
        filePath: "test-data/files/passport.pdf",
      },
    ],

    medical: [
      { fileName: "medical.pdf", filePath: "test-data/files/medical.pdf" },
    ],

    payroll: [
      {
        fileName: "bank_details.pdf",
        filePath: "test-data/files/bank_details.pdf",
      },
    ],

    exit: [],

    employeeLetters: [
      {
        fileName: "offer_letter.pdf",
        filePath: "test-data/files/offer_letter.pdf",
      },
    ],

    assets: [
      {
        fileName: "laptop_hand_over.pdf",
        filePath: "test-data/files/laptop_hand_over.pdf",
      },
    ],

    salaryAppraisals: [
      {
        fileName: "appraisal_2025.pdf",
        filePath: "test-data/files/appraisal_2025.pdf",
      },
    ],

    signatures: [
      {
        fileName: "signature.pdf",
        filePath: "test-data/files/signature.pdf",
      },
    ],
  },

  financeDetails: {
    legalEntity: "OPTION_SELECTED", // from dropdown options only
    payGroup: "OPTION_SELECTED", // from dropdown options only

    ctc: '15000', // numeric input

    bonuses: [
      {
        bonusName: "OPTION_SELECTED", // from dropdown options only
        bonusType: "Percentage", // or "Amount" (controlled UI option)
        percentage: "10",
        value: "10000",
        payoutMonth: "2026-11",
        note: "Based on yearly performance rating",
      },
      {
        bonusName: "OPTION_SELECTED", // from dropdown options only
        bonusType: "Amount",
        percentage: "12",
        value: '50000',
        payoutMonth: "2026-12",
        note: "One-time onboarding bonus",
      },
    ],

    payrollDetails: {
      providentFundEligible: true,
      esiEligible: false,
      lwfEligible: true,
    },

    taxRegime: "Old Regime", // dropdown: "New Regime" | "Old Regime"
  },
};

module.exports = { user };
