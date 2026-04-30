const { CreateUserPage } = require("../pages/CreateUserPage");
const { StepPersonalDetails } = require("../pages/steps/StepPersonalDetails");
const { StepWorkDetail } = require("../pages/steps/StepWorkDetail");
const { StepPolicySetting } = require("../pages/steps/StepPolicySetting");
const { StepUploadDocuments } = require("../pages/steps/StepUploadDocuments");
const { StepFinancialDetails } = require("../pages/steps/StepFinancialDetails");
const { TestContext } = require("../context/TestContext");
const { ErrorCapture } = require("../utils/ErrorCapture");
const { FormEngine } = require("../form-engine/FormEngine");
const { FormReadModel } = require("../utils/FormReadModel");
const { expect } = require("@playwright/test");

async function createUserFlow(page, user, test) {
  console.log("CTX CHECK:", typeof TestContext, typeof user.id);
  const userId = user.id ?? user.personalDetails?.firstName ?? "unknown";
  const ctx = new TestContext(user.id);
  console.log("CTX CREATED:", typeof ctx.log);

  const createPage = new CreateUserPage(page);
  const form = new FormEngine(page, ctx);
  const read = new FormReadModel(page);
  const errorCapture = new ErrorCapture(page, ctx);

  const step1 = new StepPersonalDetails(form, read, ctx);
  const step2 = new StepWorkDetail(form, read, ctx);
  const step3 = new StepPolicySetting(form, read, ctx);
  const step4 = new StepUploadDocuments(form, read, ctx);
  const step5 = new StepFinancialDetails(form, read, ctx);

  try {
    await createPage.goto();
    await createPage.expectDrawerOpen();
  } catch (err) {
    ctx.log(`Failed to open drawer: ${err.message}`, "error");
    err.message = `Drawer failed to open: ${err.message}`;
    err.ctx = ctx;
    throw err;
    // console.error("Flow Failed:", error.message);
  }

  await test.step("Step 1: Personal Details", async () => {
    await test.step("[personal] fill", async () => {
      try {
        await step1.fill(user.personalDetails);
      } catch (err) {
        ctx.log(`[personal] fill failed: ${err.message}`, "error");
        err.message = `Step 1 fill failed: ${err.message}`;
        throw err;
      }
    });
    await test.step("[personal] capture employee ID", async () => {
      try {
        await step1.captureEmployeeId();
      } catch (err) {
        ctx.log(`[personal] captureEmployeeId failed: ${err.message}`, "error");
        err.message = `captureEmployeeId failed: ${err.message}`;
        throw err;
      }
    });
    await test.step("[personal] validate", async () => {
      try {
        await step1.validate(user.personalDetails);
      } catch (err) {
        ctx.log(`[personal] validate failed: ${err.message}`, "error");
        err.message = `Step 1 validate failed: ${err.message}`;
        throw err;
      }
    });
    await test.step("[personal] assert no UI errors", async () => {
      try {
        await errorCapture.assertNoErrors(expect, "Step1");
      } catch (err) {
        ctx.log(`[personal] UI errors: ${err.message}`, "error");
        throw err;
      }
    });
  });
  try {
    await createPage.nextStep();
  } catch (err) {
    ctx.log(`Failed to advance from Step 1: ${err.message}`, "error");
    err.message = `nextStep() after Step 1 failed: ${err.message}`;
    err.ctx = ctx;
    throw err;
  }

  // ── Step 2: Work Details ─────────────────────────────────────
  await test.step("Step 2: Work Details", async () => {
    await test.step("[work] assert drawer open", async () => {
      try {
        await createPage.expectDrawerOpen();
      } catch (err) {
        ctx.log(`[work] drawer not open: ${err.message}`, "error");
        throw err;
      }
    });

    await test.step("[work] fill", async () => {
      try {
        await step2.fill(user.workDetails);
      } catch (err) {
        ctx.log(`[work] fill failed: ${err.message}`, "error");
        err.message = `Step 2 fill failed: ${err.message}`;
        throw err;
      }
    });

    await test.step("[work] validate", async () => {
      try {
        await step2.validate();
      } catch (err) {
        ctx.log(`[work] validate failed: ${err.message}`, "error");
        err.message = `Step 2 validate failed: ${err.message}`;
        throw err;
      }
    });

    await test.step("[work] assert no UI errors", async () => {
      try {
        await errorCapture.assertNoErrors(expect, "Step2");
      } catch (err) {
        ctx.log(`[work] UI errors: ${err.message}`, "error");
        throw err;
      }
    });
  });

  try {
    await createPage.nextStep();
  } catch (err) {
    ctx.log(`Failed to advance from Step 2: ${err.message}`, "error");
    err.message = `nextStep() after Step 2 failed: ${err.message}`;
    err.ctx = ctx;
    throw err;
  }

  // ── Step 3: Policy Setting ───────────────────────────────────
  await test.step("Step 3: Policy Setting", async () => {
    await test.step("[policy] fill", async () => {
      try {
        await step3.fill(user.policySetting);
      } catch (err) {
        ctx.log(`[policy] fill failed: ${err.message}`, "error");
        err.message = `Step 3 fill failed: ${err.message}`;
        throw err;
      }
    });

    await test.step("[policy] validate", async () => {
      try {
        await step3.validate();
      } catch (err) {
        ctx.log(`[policy] validate failed: ${err.message}`, "error");
        err.message = `Step 3 validate failed: ${err.message}`;
        throw err;
      }
    });

    await test.step("[policy] assert no UI errors", async () => {
      try {
        await errorCapture.assertNoErrors(expect, "Step3");
      } catch (err) {
        ctx.log(`[policy] UI errors: ${err.message}`, "error");
        throw err;
      }
    });
  });

  try {
    await createPage.nextStep();
  } catch (err) {
    ctx.log(`Failed to advance from Step 3: ${err.message}`, "error");
    err.message = `nextStep() after Step 3 failed: ${err.message}`;
    err.ctx = ctx;
    throw err;
  }

  // ── Step 4: Upload Documents ─────────────────────────────────
  await test.step("Step 4: Upload Documents", async () => {
    await test.step("[upload] fill", async () => {
      try {
        await step4.fill(user.uploadDocument);
      } catch (err) {
        ctx.log(`[upload] fill failed: ${err.message}`, "error");
        err.message = `Step 4 fill failed: ${err.message}`;
        throw err;
      }
    });

    await test.step("[upload] validate", async () => {
      try {
        await step4.validate();
      } catch (err) {
        ctx.log(`[upload] validate failed: ${err.message}`, "error");
        err.message = `Step 4 validate failed: ${err.message}`;
        throw err;
      }
    });

    await test.step("[upload] assert no UI errors", async () => {
      try {
        await errorCapture.assertNoErrors(expect, "Step4");
      } catch (err) {
        ctx.log(`[upload] UI errors: ${err.message}`, "error");
        throw err;
      }
    });
  });

  try {
    await createPage.nextStep();
  } catch (err) {
    ctx.log(`Failed to advance from Step 4: ${err.message}`, "error");
    err.message = `nextStep() after Step 4 failed: ${err.message}`;
    err.ctx = ctx;
    throw err;
  }

  // ── Step 5: Finance Details ──────────────────────────────────
  await test.step("Step 5: Finance Details", async () => {
    await test.step("[finance] fill", async () => {
      try {
        await step5.fill(user.financeDetails);
      } catch (err) {
        ctx.log(`[finance] fill failed: ${err.message}`, "error");
        err.message = `Step 5 fill failed: ${err.message}`;
        throw err;
      }
    });

    await test.step("[finance] validate", async () => {
      try {
        await step5.validate();
      } catch (err) {
        ctx.log(`[finance] validate failed: ${err.message}`, "error");
        err.message = `Step 5 validate failed: ${err.message}`;
        throw err;
      }
    });

    await test.step("[finance] assert no UI errors", async () => {
      try {
        await errorCapture.assertNoErrors(expect, "Step5");
      } catch (err) {
        ctx.log(`[finance] UI errors: ${err.message}`, "error");
        throw err;
      }
    });
  });

  // ── Submit ───────────────────────────────────────────────────
  await test.step("Submit: create employee", async () => {
    try {
      await createPage.createEmployee();
      // const toastMessage = await createPage.handleOnboardingEmailPopup(true);
      // ctx.setGenerated("successToast", toastMessage);
      // ctx.log(`Employee created — toast: "${toastMessage}"`, "info");
      await createPage.handleOnboardingEmailPopup(true); // handles modal only
      const toastMessage = await errorCapture.waitForSuccessToast(15_000);
      ctx.log(`Employee created — toast: "${toastMessage}"`, "info");
    } catch (err) {
      ctx.log(`Submit failed: ${err.message}`, "error");
      err.message = `Submit failed: ${err.message}`;
      throw err;
    }
  });

  return ctx;
}

module.exports = { createUserFlow };
