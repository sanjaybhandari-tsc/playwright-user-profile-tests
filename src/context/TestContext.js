class TestContext {
  constructor(userId) {
    if (
      userId !== undefined &&
      userId !== null &&
      typeof userId !== "string" &&
      typeof userId !== "number"
    ) {
      throw new TypeError(
        `userId must be a string or number, got ${typeof userId}`,
      );
    }
    this.userId = userId ?? null;
    this.final = {};
    this.toasts = [];
    this.fieldErrors = [];
    this.input = {
      personal: {},
      work: {},
      policy: {},
      upload: {},
      finance: {},
    };
    this.ui = {
      masterTable: {},
      ctcTable: {},
    };
    this.generated = {
      employeeId: null,
    };
    this.fallback = {};
    this.mismatches = [];
    this.logs = [];
  }

  setEmployeeId(id) {
    this.generated.employeeId = id;
  }

  addMismatch({ field, expected, actual, source = "unknown" }) {
    if (!field || expected === undefined || actual === undefined) {
      throw new Error("Mismatch must include field, expected, and actual");
    }
    this.mismatches.push({
      field,
      expected,
      actual,
      source,
      time: new Date().toISOString(),
    });
  }
  hasMismatches() {
    return this.mismatches.length > 0;
  }
  setGenerated(key, value) {
    this.generated[key] = value;
  }
  setFallback(key, value) {
    this.fallback[key] = value;
  }

  log(message, level = "info") {
    const LEVELS = ["info", "warn", "error", "debug"];
    if (!LEVELS.includes(level)) throw new Error(`Invalid log level: ${level}`);
    this.logs.push({ time: new Date().toISOString(), level, message });
  }
  setInput(group, key, value) {
    const VALID_GROUPS = ["personal", "work", "policy", "upload", "finance"];
    if (!VALID_GROUPS.includes(group)) {
      throw new Error(
        `Invalid input group "${group}". Must be one of: ${VALID_GROUPS.join(", ")}`,
      );
    }
    this.input[group][key] = value;
  }
  getInput(group, key) {
    return this.input[group]?.[key] ?? null;
  }
  getFinal(key) {
    return this.final[key] ?? null;
  }

  setFinal(key, value) {
    this.final[key] = value;
  }

  reset() {
    this.final = {};
    this.mismatches = [];
    this.logs = [];
    this.toasts = [];
    this.fieldErrors = [];
    this.fallback = {};
    this.generated = { employeeId: null };
    this.input = {
      personal: {},
      work: {},
      policy: {},
      upload: {},
      finance: {},
    };
    this.ui = { masterTable: {}, ctcTable: {} };
  }
  addToast(toast) {
  this.toasts = this.toasts || [];
  this.toasts.push({ ...toast, time: new Date().toISOString() });
}

addFieldError(err) {
  this.fieldErrors = this.fieldErrors || [];
  this.fieldErrors.push({ ...err, time: new Date().toISOString() });
}
  toJSON() {
    return {
      userId: this.userId,
      input: this.input, // personal/work/policy/finance/uploads
      final: this.final, // effective value of every field
      generated: this.generated, // classified types + employeeId
      fallback: this.fallback, // fields where no value was provided
      ui: this.ui, // masterTable / ctcTable
      mismatches: this.mismatches,
      toasts: this.toasts,
      fieldErrors: this.fieldErrors,
      logs: this.logs,
    };
  }
}

module.exports = { TestContext };
