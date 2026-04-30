function parseUsers(rows) {
  return rows.map(row => ({
    personalDetails: {
      firstName: row["personal.firstName"],
      middleName: row["personal.middleName"],
      lastName: row["personal.lastName"],
      dateOfBirth: row["personal.dob"],
      gender: row["personal.gender"],
      maritalStatus: row["personal.maritalStatus"],
      phone: row["personal.phone"],
      employeeSeries: row["personal.employeeSeries"],
      joiningDate: row["personal.joiningDate"],
      skills: row["personal.skills"]?.split(",") || []
    },

    workDetails: {
      role: row["work.role"],
      location: row["work.location"],
      workMode: row["work.workMode"]
    },

    financeDetails: {
      ctc: row["finance.ctc"]
    }
  }));
}

module.exports = { parseUsers };