const { test, expect } = require("@playwright/test");
const users = require("../src/data/users.json");

const { reportCtxToPlaywright } = require("../src/utils/ctxReporter");
const { createUserFlow } = require("../src/flows/createUser.flow");
const {
  StepPersonalDetails,
  StepWorkDetail,
  StepPolicySetting,
  StepUploadDocuments,
  StepFinancialDetails,
} = require("../src/pages/steps");

const steps = [
  StepPersonalDetails,
  StepWorkDetail,
  StepPolicySetting,
  StepUploadDocuments,
  StepFinancialDetails,
];

// shared results array across all user tests
const results = [];

// ── One test per user ────────────────────────────────────────
users.forEach((user, i) => {
  test(`User ${i + 1}: ${user.personalDetails?.firstName || "Unknown"}`, async ({
    page,
  }) => {
    test.setTimeout(120000);

    const ctx = await createUserFlow(page, user, steps);
    try {
      await reportCtxToPlaywright(test, test.info(), ctx, i + 1);
      await test.info().attach(`User-${i + 1}-full-ctx`, {
        body: JSON.stringify(ctx.toJSON(), null, 2),
        contentType: "application/json",
      });
      // ── HARD — success toast is the only pass condition ─
      expect(
        ctx.generated.successToast,
        `User ${i + 1}: success toast was not shown — user was NOT created`,
      ).toBeTruthy();

      // ── SOFT — nice to have but don't fail the test ─────
      expect
        .soft(
          ctx.generated.employeeId,
          `User ${i + 1}: employeeId was not captured`,
        )
        .toBeDefined();

      results.push({
        index: i + 1,
        name: user.personalDetails?.firstName || "Unknown",
        employeeId: ctx.generated.employeeId,
        successToast: ctx.generated.successToast,
        status: "PASS",
        mismatches: ctx.mismatches,
        warnings: ctx.mismatches.filter(
          (m) => m.actual === "not found in dropdown",
        ),
      });
    } catch (err) {
      const ctx = err.ctx;
      console.error(` User ${i + 1} failed: ${err.message}`);

      if (ctx) {
        await test.info().attach(`User-${i + 1}-partial-ctx`, {
          body: JSON.stringify(ctx.toJSON(), null, 2),
          contentType: "application/json",
        });

        // still report what was captured
        await reportCtxToPlaywright(test, test.info(), ctx, i + 1);
      }
      await test.info().attach(`User-${i + 1}-partial-ctx`, {
        body: JSON.stringify(
          ctx?.toJSON?.() || { error: err.message },
          null,
          2,
        ),
        contentType: "application/json",
      });

      results.push({
        index: i + 1,
        name: user.personalDetails?.firstName || "Unknown",
        employeeId: null,
        successToast: null,
        status: "FAIL",
        mismatches: [],
        warnings: [],
        error: err.message,
      });
    }
  });
});

// ── Summary test (runs after all users) ──────────────────────
test("Bulk Summary", async ({}) => {
  test.setTimeout(30000);

  const summary = {
    total: results.length,
    passed: results.filter((r) => r.status === "PASS").length,
    failed: results.filter((r) => r.status === "FAIL").length,
    results,
  };

  console.log("BULK SUMMARY:", JSON.stringify(summary, null, 2));

  await test.info().attach("bulk-summary", {
    body: JSON.stringify(summary, null, 2),
    contentType: "application/json",
  });

  // print failed users to console
  const failedUsers = results.filter((r) => r.status === "FAIL");
  if (failedUsers.length) {
    console.log("Failed users:");
    failedUsers.forEach((r) => {
      console.log(
        `  - User ${r.index} (${r.name}): ${r.error || `${r.mismatchCount} mismatches`}`,
      );
    });
  }

  expect.soft(summary.failed, `${summary.failed} user(s) failed`).toBe(0);
});
