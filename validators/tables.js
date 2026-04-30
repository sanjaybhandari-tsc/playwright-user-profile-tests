module.exports = {
  MASTER_TABLE: {
    name: 'master',
    selector: '#masterTable',
    rowMap: {
      firstName: "#master_first_name",
      lastName: "#master_last_name",
      employeeId: "#master_employee_id"
    }
  },

  CTC_TABLE: {
    name: 'ctc',
    selector: '#ctcTable',
    rowMap: {
      base: "#ctc_base",
      bonus: "#ctc_bonus",
      employeeId: "#ctc_employee_id"
    }
  }
};