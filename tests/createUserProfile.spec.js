const { test, expect } = require("@playwright/test");
const { allure } = require("allure-playwright");
const users = require("../src/data/users.json");
const { reportCtxToPlaywright } = require("../src/utils/ctxReporter");
const { createUserFlow } = require("../src/flows/createUser.flow");

const results = [];

users.forEach((user, i) => {
  test(
    `User ${i + 1}: ${user.personalDetails?.firstName || "Unknown"} ${user.personalDetails?.lastName || ""}`.trim(),
    async ({ page }) => {
      test.setTimeout(180000);

      // ── Allure metadata ──────────────────────────────────
      allure.epic("User Management");
      allure.feature("Create User Profile");
      allure.story(`User ${i + 1}: ${user.personalDetails?.firstName}`);
      allure.severity("critical");
      allure.label("userId", user.id ?? `user_0${i + 1}`);

      let ctx;

      try {
        ctx = await createUserFlow(page, user, test);
      } catch (err) {
        ctx = err.ctx || ctx;

        await test.info().attach(`User-${i + 1}-partial-ctx`, {
          body: JSON.stringify(ctx?.toJSON?.() || { error: err.message }, null, 2),
          contentType: "application/json",
        });

        if (ctx) {
          await reportCtxToPlaywright(test, test.info(), ctx, i + 1);
          // ── Allure: attach partial ctx on failure ────────
          allure.attachment(
            `User-${i + 1}-partial-ctx`,
            JSON.stringify(ctx.toJSON(), null, 2),
            "application/json"
          );
        }

        results.push({
          index: i + 1,
          name: `${user.personalDetails?.firstName || "Unknown"}`,
          status: "FAIL",
          mismatches: ctx?.mismatches || [],
          fieldErrors: ctx?.fieldErrors || [],
          toasts: ctx?.toasts || [],
          error: err.message,
        });

        throw err;
      }

      // ── Attachments ──────────────────────────────────────
      await test.info().attach(`User-${i + 1}-full-ctx`, {
        body: JSON.stringify(ctx.toJSON(), null, 2),
        contentType: "application/json",
      });

      // ── Allure: attach full ctx + summary ────────────────
      allure.attachment(
        `User-${i + 1}-full-ctx`,
        JSON.stringify(ctx.toJSON(), null, 2),
        "application/json"
      );
      allure.attachment(
        `User-${i + 1}-summary`,
        buildSummaryText(ctx, i + 1),
        "text/plain"
      );

      await reportCtxToPlaywright(test, test.info(), ctx, i + 1);

      // ── Assertions ───────────────────────────────────────
      await test.step("Assert: success toast received", async () => {
        expect(
          ctx.generated.successToast,
          `User ${i + 1}: success toast not shown`,
        ).toBeTruthy();
      });

      await test.step("Assert: employee ID generated", async () => {
        expect(
          ctx.generated.employeeId,
          `User ${i + 1}: employeeId not captured`,
        ).toBeTruthy();
      });

      await test.step("Assert: no field errors", async () => {
        if (ctx.fieldErrors.length) {
          const lines = ctx.fieldErrors.map(e => `  [${e.field}]: "${e.message}"`);
          expect.soft(ctx.fieldErrors.length, `Field errors:\n${lines.join("\n")}`).toBe(0);
        }
      });

      await test.step("Assert: no error toasts", async () => {
        const errorToasts = ctx.toasts.filter(t =>
          ["error", "failed", "invalid", "required"].some(k =>
            t.message?.toLowerCase().includes(k)
          )
        );
        if (errorToasts.length) {
          const lines = errorToasts.map(t => `  "${t.message}"`);
          expect.soft(errorToasts.length, `Error toasts:\n${lines.join("\n")}`).toBe(0);
        }
      });

      await test.step("Assert: no field mismatches", async () => {
        if (ctx.hasMismatches()) {
          const lines = ctx.mismatches.map(m =>
            `  [${m.field}] expected="${m.expected}" got="${m.actual}" (${m.source})`
          );
          expect.soft(ctx.mismatches.length, `Mismatches:\n${lines.join("\n")}`).toBe(0);
        }
      });

      results.push({
        index: i + 1,
        name: `${user.personalDetails?.firstName || "Unknown"}`,
        employeeId: ctx.generated.employeeId,
        successToast: ctx.generated.successToast,
        status: "PASS",
        mismatches: ctx.mismatches,
        fieldErrors: ctx.fieldErrors,
        toasts: ctx.toasts,
        warnings: ctx.mismatches.filter(m => m.actual === "not found in dropdown"),
      });
    }
  );
});

// ── Summary test ─────────────────────────────────────────────
test("Bulk Summary", async () => {
  test.setTimeout(30000);

  allure.epic("User Management");
  allure.feature("Bulk Summary");

  const passed = results.filter(r => r.status === "PASS");
  const failed = results.filter(r => r.status === "FAIL");

  const summary = {
    total: results.length,
    passed: passed.length,
    failed: failed.length,
    results,
  };

  console.log("BULK SUMMARY:", JSON.stringify(summary, null, 2));

  await test.info().attach("bulk-summary", {
    body: JSON.stringify(summary, null, 2),
    contentType: "application/json",
  });

  allure.attachment(
    "bulk-summary",
    JSON.stringify(summary, null, 2),
    "application/json"
  );

  if (failed.length) {
    console.log("\nFailed users:");
    failed.forEach(r => {
      console.log(`  - User ${r.index} (${r.name}): ${r.error || "see mismatches"}`);
      r.fieldErrors?.forEach(e => console.log(`    [${e.field}]: "${e.message}"`));
      r.mismatches?.forEach(m => console.log(`    [${m.field}] expected="${m.expected}" got="${m.actual}"`));
    });
  }

  expect.soft(summary.failed, `${summary.failed} user(s) failed`).toBe(0);
});

// ── Summary text builder ──────────────────────────────────────
function buildSummaryText(ctx, index) {
  const lines = [];

  lines.push(`═══════════════════════════════`);
  lines.push(`USER ${index} — ${ctx.userId}`);
  lines.push(`═══════════════════════════════`);

  lines.push(`\n── Generated ──`);
  lines.push(`  Employee ID  : ${ctx.generated.employeeId ?? "not captured"}`);
  lines.push(`  Success Toast: ${ctx.generated.successToast ?? "not shown"}`);

  lines.push(`\n── Personal Input ──`);
  Object.entries(ctx.input.personal).forEach(([k, v]) =>
    lines.push(`  ${k}: ${v}`)
  );

  lines.push(`\n── Work Input ──`);
  Object.entries(ctx.input.work).forEach(([k, v]) =>
    lines.push(`  ${k}: ${JSON.stringify(v)}`)
  );

  lines.push(`\n── Policy Input ──`);
  Object.entries(ctx.input.policy).forEach(([k, v]) =>
    lines.push(`  ${k}: ${v}`)
  );

  lines.push(`\n── Finance Input ──`);
  Object.entries(ctx.input.finance).forEach(([k, v]) =>
    lines.push(`  ${k}: ${v}`)
  );

  if (ctx.mismatches.length) {
    lines.push(`\n── Mismatches (${ctx.mismatches.length}) ──`);
    ctx.mismatches.forEach(m =>
      lines.push(`  [${m.field}] expected="${m.expected}" got="${m.actual}" (${m.source})`)
    );
  }

  if (ctx.fieldErrors.length) {
    lines.push(`\n── Field Errors (${ctx.fieldErrors.length}) ──`);
    ctx.fieldErrors.forEach(e =>
      lines.push(`  [${e.field}]: "${e.message}"`)
    );
  }

  if (ctx.toasts.length) {
    lines.push(`\n── Toasts ──`);
    ctx.toasts.forEach(t => lines.push(`  "${t.message}"`));
  }

  if (ctx.logs.length) {
    lines.push(`\n── Logs ──`);
    ctx.logs.forEach(l =>
      lines.push(`  [${l.level.toUpperCase()}] ${l.message}`)
    );
  }

  return lines.join("\n");
}