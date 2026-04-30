const fs = require("fs");
const { fallbackRegistry } = require("../../data/fallbackRegistry");
const { BaseStep } = require("./BaseStep");
const { expect } = require("@playwright/test");

class StepUploadDocuments extends BaseStep{
 constructor(form, readModel, ctx) {
    super(form, readModel, ctx);
    this.fields = {
      employeeAgreements: {
        selector:
          'div.w-full:has(span:text-is("Employee Agreements")) input[type="file"]',
        group: "upload",
      },
      miscellaneous: {
        selector:
          'div.w-full:has(span:text-is("Miscellaneous")) input[type="file"]',
        group: "upload",
      },
      education: {
        selector:
          'div.w-full:has(span:text-is("Education")) input[type="file"]',
        group: "upload",
      },
      previousEmployment: {
        selector:
          'div.w-full:has(span:text-is("Previous Employment")) input[type="file"]',
        group: "upload",
      },
      onboarding: {
        selector:
          'div.w-full:has(span:text-is("Onboarding")) input[type="file"]',
        group: "upload",
      },
      incomeTax: {
        selector:
          'div.w-full:has(span:text-is("Income Tax")) input[type="file"]',
        group: "upload",
      },
      identity: {
        selector: 'div.w-full:has(span:text-is("Identity")) input[type="file"]',
        group: "upload",
      },
      medical: {
        selector: 'div.w-full:has(span:text-is("Medical")) input[type="file"]',
        group: "upload",
      },
      payroll: {
        selector: 'div.w-full:has(span:text-is("Payroll")) input[type="file"]',
        group: "upload",
      },
      exit: {
        selector: 'div.w-full:has(span:text-is("Exit")) input[type="file"]',
        group: "upload",
      },
      employeeLetters: {
        selector:
          'div.w-full:has(span:text-is("Employee Letters")) input[type="file"]',
        group: "upload",
      },
      assets: {
        selector: 'div.w-full:has(span:text-is("Assets")) input[type="file"]',
        group: "upload",
      },
      salaryAppraisals: {
        selector:
          'div.w-full:has(span:text-is("Salary Appraisals")) input[type="file"]',
        group: "upload",
      },
      signatures: {
        selector:
          'div.w-full:has(span:text-is("Signatures")) input[type="file"]',
        group: "upload",
      },
    };
    this.form.registerFields(this.fields);
  }

  async fill(rawData) {
    
    const data = { ...fallbackRegistry.uploadDocument };
  for (const [key, val] of Object.entries(rawData || {})) {
    if (val !== null && val !== undefined) {
      data[key] = val;
    }
  }
    await this.uploadFiles("employeeAgreements", data.employeeAgreements);
    // await this.uploadFiles("miscellaneous", data.miscellaneous);
    // await this.uploadFiles("education", data.education);
    // await this.uploadFiles("previousEmployment", data.previousEmployment);
    // await this.uploadFiles("onboarding", data.onboarding);
    // await this.uploadFiles("incomeTax", data.incomeTax);
    // await this.uploadFiles("identity", data.identity);
    // await this.uploadFiles("medical", data.medical);
    // await this.uploadFiles("payroll", data.payroll);
    // await this.uploadFiles("exit", data.exit);
    // await this.uploadFiles("employeeLetters", data.employeeLetters);
    // await this.uploadFiles("assets", data.assets);
    // await this.uploadFiles("salaryAppraisals", data.salaryAppraisals);
    // await this.uploadSignature("signatures", data.signatures);
  }


  async uploadFiles(fieldKey, files = []) {
    if (!files?.length) return;

    const { selector, group } = this.fields[fieldKey]; //  resolve from fields
    const page = this.form.page;

    const fileArray = Array.isArray(files) ? files : [files];

    this.ctx.log(
      `uploadFiles "${fieldKey}": uploading ${fileArray.length} file(s)`,
      "info",
    );

    const uploaded = [];
    const failed = [];

    for (const file of fileArray) {
      // 1. validate file exists
      if (!fs.existsSync(file.filePath)) {
        this.ctx.log(
          `uploadFiles "${fieldKey}": file not found "${file.filePath}"`,
          "error",
        );
        this.ctx.addMismatch({
          field: fieldKey,
          expected: file.fileName,
          actual: "file not found on disk",
          source: "uploadFiles",
        });
        failed.push(file.fileName);
        continue; //  don't throw — keep going with remaining files
      }

      const container = page.locator(selector).first();
      await expect(container).toHaveCount(1);
      await container.setInputFiles(file.filePath);

      this.ctx.log(
        `uploadFiles "${fieldKey}": uploaded "${file.fileName}"`,
        "info",
      );
      uploaded.push(file.fileName);

      await page.waitForTimeout(3000);
    }

    //  track to ctx after all uploads
    if (uploaded.length) {
      this.ctx.setInput(group, fieldKey, uploaded);
      this.ctx.setFinal(fieldKey, uploaded);
    }

    //  summary log
    this.ctx.log(
      `uploadFiles "${fieldKey}": done — uploaded: [${uploaded.join(", ")}]${failed.length ? ` | failed: [${failed.join(", ")}]` : ""}`,
      failed.length ? "warn" : "info",
    );
  }

  async uploadSignature(fieldKey, files = []) {
    if (!files?.length) return;

    const { group } = this.fields[fieldKey]; //  only need group, selector is fixed DOM structure
    const page = this.form.page;

    const fileArray = Array.isArray(files) ? files : [files];

    this.ctx.log(
      `uploadSignature: uploading ${fileArray.length} file(s)`,
      "info",
    );

    const input = page
      .locator('div.w-full:has(span:text-is("Signatures")) input[type="file"]')
      .first();

    await expect(input).toHaveCount(1);

    const uploaded = [];
    const failed = [];

    for (const file of fileArray) {
      if (!fs.existsSync(file.filePath)) {
        this.ctx.log(
          `uploadSignature: file not found "${file.filePath}"`,
          "error",
        );
        this.ctx.addMismatch({
          field: fieldKey,
          expected: file.fileName,
          actual: "file not found on disk",
          source: "uploadSignature",
        });
        failed.push(file.fileName);
        continue; //  don't throw — keep going
      }

      await input.setInputFiles(file.filePath);

      //  verify UI confirms upload
      try {
        await expect(page.getByText(file.fileName)).toBeVisible({
          timeout: 10000,
        });
        uploaded.push(file.fileName);
        this.ctx.log(
          `uploadSignature: confirmed "${file.fileName}" visible in UI`,
          "info",
        );
      } catch {
        // file was set but UI didn't confirm — still record it
        uploaded.push(file.fileName);
        this.ctx.log(
          `uploadSignature: "${file.fileName}" uploaded but not confirmed in UI`,
          "warn",
        );
      }
    }

    //  track to ctx
    if (uploaded.length) {
      this.ctx.setInput(group, fieldKey, uploaded);
      this.ctx.setFinal(fieldKey, uploaded);
    }

    this.ctx.log(
      `uploadSignature: done — uploaded: [${uploaded.join(", ")}]${failed.length ? ` | failed: [${failed.join(", ")}]` : ""}`,
      failed.length ? "warn" : "info",
    );
  }

  async validate() {
    const safeRun = async (fn, label) => {
  try { await fn(); }
  catch (err) {
    this.ctx.log(`[${label}] ${err.message}`, "error");
    this.ctx.addMismatch({
      field: label,
      expected: "no error",
      actual: err.message,
      source: this.constructor.name,
    });
    throw err;  // ← re-throw
  }
};

    await safeRun(() => this.validateUploads("employeeAgreements"), "employeeAgreements");
await safeRun(() => this.validateUploads("miscellaneous"), "miscellaneous");
await safeRun(() => this.validateUploads("education"), "education");
await safeRun(() => this.validateUploads("previousEmployment"), "previousEmployment");
await safeRun(() => this.validateUploads("onboarding"), "onboarding");
await safeRun(() => this.validateUploads("incomeTax"), "incomeTax");
await safeRun(() => this.validateUploads("identity"), "identity");
await safeRun(() => this.validateUploads("medical"), "medical");
await safeRun(() => this.validateUploads("payroll"), "payroll");
await safeRun(() => this.validateUploads("exit"), "exit");
await safeRun(() => this.validateUploads("employeeLetters"), "employeeLetters");
await safeRun(() => this.validateUploads("assets"), "assets");
await safeRun(() => this.validateUploads("salaryAppraisals"), "salaryAppraisals");
await safeRun(() => this.validateUploads("signatures"), "signatures");
  }

  async validateUploads(fieldKey) {
    const uploaded = this.ctx.getFinal(fieldKey); // array of filenames set during fill()
    if (!uploaded?.length) return;

    const page = this.form.page;

    for (const fileName of uploaded) {
      const isVisible = await page.getByText(fileName).isVisible();

      if (isVisible) {
        this.ctx.log(` ${fieldKey}: "${fileName}" visible in UI`, "info");
      } else {
        this._recordMismatch(fieldKey, fileName, "not visible in UI");
      }
    }
  }
}

module.exports = { StepUploadDocuments };