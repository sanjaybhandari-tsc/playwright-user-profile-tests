const fallbackRegistry = {
  personalDetails: {
    maritalStatus: "Unmarried",
    gender: "Other",
    dateOfBirth: "2000-01-01",
    joiningDate: "2008-04-28",
    skills: []
  },

  workDetails: {
    role:"Limited Access Role",
    protectDocumentRestrictedAccess: true
  },

  policySetting: {
    isProbationDurationApplicable: false,
    shiftPolicy: "Half Weekend",
    attendancePolicy: "Attendance Policy",
    leavePolicy: "TSC Leave Policy - 01",
  },

  financeDetails: {
    legalEntity: "Collectivwork",
    payGroup: "Collectiv - PG",
    taxRegime: "Old Regime"
  }
};

module.exports = { fallbackRegistry };



// const fallbackRegistry = {
//   personalDetails: {
//     firstName: null,
//     middleName: null,
//     lastName: null,
//     dateOfBirth: "2000-01-01",
//     gender: "Other",
//     maritalStatus: "Unmarried",
//     phone: null,
//     employeeSeries: null,
//     joiningDate: "2008-04-28",
//     skills: [],
//   },

//   workDetails: {
//     workEmail: null,
//     location: null,
//     role: "Limited Access Role",
//     employmentStatus: null,
//     employmentType: null,
//     workMode: null,
//     businessUnit: null,
//     holidayPlan: null,
//     department: null,
//     organizationName: null,
//     designation: null,
//     grade: null,
//     band: null,
//     reportingManager: null,
//     hrManager: null,
//     l2Manager: null,
//     associateManager: [],
//     protectDocumentRestrictedAccess: true,
//   },

//   policySetting: {
//     isProbationDurationApplicable: false,
//     onboardingPolicy: null,
//     shiftPolicy: "Half Weekend",
//     attendancePolicy: "Attendance Policy",
//     leavePolicy: "TSC Leave Policy - 01",
//     reimbursementPolicy: null,
//     offboardingPolicy: null,
//     overtimePolicy: null,
//   },

//   uploadDocument: {
//     employeeAgreements: [],
//     miscellaneous: [],
//     education: [],
//     previousEmployment: [],
//     onboarding: [],
//     incomeTax: [],
//     identity: [],
//     medical: [],
//     payroll: [],
//     exit: [],
//     employeeLetters: [],
//     assets: [],
//     salaryAppraisals: [],
//     signatures: [],
//   },

//   financeDetails: {
//     legalEntity: "Collectiwork",
//     payGroup: "Collectiv - PG",
//     ctc: null,
//     taxRegime: "Old Regime",
//     providentFundEligible: null,
//     esiEligible: null,
//     lwfEligible: null,
//     bonuses: [],
//   },
// };

// module.exports = { fallbackRegistry };