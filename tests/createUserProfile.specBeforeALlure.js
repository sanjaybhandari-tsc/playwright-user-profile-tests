const { test, expect } = require("@playwright/test");
const users = require("../src/data/users.json");
const { reportCtxToPlaywright } = require("../src/utils/ctxReporter");
const { createUserFlow } = require("../src/flows/createUser.flow");

// shared results array across all user tests
const results = [];

// ── One test per user ────────────────────────────────────────
users.forEach((user, i) => {
  test(
    `User ${i + 1}: ${user.personalDetails?.firstName || "Unknown"} ${user.personalDetails?.lastName || ""}`.trim(),
    async ({ page }) => {
      test.setTimeout(180000); // bumped — 120s can be tight for 5 steps

      let ctx;

      try {
        // ← pass test in so createUserFlow can use test.step
        ctx = await createUserFlow(page, user, test);
      } catch (err) {
        // grab ctx off the error if flow attached it
        ctx = err.ctx || ctx;

        // attach whatever ctx was captured before the crash
        await test.info().attach(`User-${i + 1}-partial-ctx`, {
          body: JSON.stringify(ctx?.toJSON?.() || { error: err.message }, null, 2),
          contentType: "application/json",
        });

        if (ctx) {
          await reportCtxToPlaywright(test, test.info(), ctx, i + 1);
        }

        results.push({
          index: i + 1,
          name: `${user.personalDetails?.firstName || "Unknown"} ${user.personalDetails?.lastName || ""}`.trim(),
          employeeId: null,
          successToast: null,
          status: "FAIL",
          mismatches: ctx?.mismatches || [],
          fieldErrors: ctx?.fieldErrors || [],
          toasts: ctx?.toasts || [],
          warnings: [],
          error: err.message,
        });

        throw err; // ← re-throw so Playwright marks the test red
      }

      // ── ctx is available — run post-flow assertions ────────
      await test.info().attach(`User-${i + 1}-full-ctx`, {
        body: JSON.stringify(ctx.toJSON(), null, 2),
        contentType: "application/json",
      });

      await reportCtxToPlaywright(test, test.info(), ctx, i + 1);

      // ── HARD assert — user creation ───────────────────────
      await test.step("Assert: success toast received", async () => {
        expect(
          ctx.generated.successToast,
          `User ${i + 1}: success toast not shown — user was NOT created`,
        ).toBeTruthy();
      });

      // ── HARD assert — employee ID captured ───────────────
      await test.step("Assert: employee ID generated", async () => {
        expect(
          ctx.generated.employeeId,
          `User ${i + 1}: employeeId was not captured`,
        ).toBeTruthy();
      });

      // ── SOFT assert — field errors shown in UI ────────────
      await test.step("Assert: no field errors", async () => {
        if (ctx.fieldErrors.length) {
          const lines = ctx.fieldErrors.map(
            (e) => `  [${e.field}]: "${e.message}"`
          );
          expect.soft(
            ctx.fieldErrors.length,
            `Field errors detected:\n${lines.join("\n")}`,
          ).toBe(0);
        }
      });

      // ── SOFT assert — error toasts ────────────────────────
      await test.step("Assert: no error toasts", async () => {
        const errorToasts = ctx.toasts.filter((t) =>
          ["error", "failed", "invalid", "required"].some((k) =>
            t.message?.toLowerCase().includes(k)
          )
        );
        if (errorToasts.length) {
          const lines = errorToasts.map((t) => `  "${t.message}"`);
          expect.soft(
            errorToasts.length,
            `Error toasts detected:\n${lines.join("\n")}`,
          ).toBe(0);
        }
      });

      // ── SOFT assert — data mismatches ─────────────────────
      await test.step("Assert: no field mismatches", async () => {
        if (ctx.hasMismatches()) {
          const lines = ctx.mismatches.map(
            (m) =>
              `  [${m.field}] expected="${m.expected}" got="${m.actual}" (${m.source})`
          );
          expect.soft(
            ctx.mismatches.length,
            `Field mismatches detected:\n${lines.join("\n")}`,
          ).toBe(0);
        }
      });

      // ── push to summary ───────────────────────────────────
      results.push({
        index: i + 1,
        name: `${user.personalDetails?.firstName || "Unknown"} ${user.personalDetails?.lastName || ""}`.trim(),
        employeeId: ctx.generated.employeeId,
        successToast: ctx.generated.successToast,
        status: "PASS",
        mismatches: ctx.mismatches,
        fieldErrors: ctx.fieldErrors,
        toasts: ctx.toasts,
        warnings: ctx.mismatches.filter(
          (m) => m.actual === "not found in dropdown"
        ),
      });
    }
  );
});

// ── Summary test (runs after all users) ──────────────────────
test("Bulk Summary", async () => {
  test.setTimeout(30000);

  const passed = results.filter((r) => r.status === "PASS");
  const failed = results.filter((r) => r.status === "FAIL");

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

  // ── print failed users to console ─────────────────────────
  if (failed.length) {
    console.log("\nFailed users:");
    failed.forEach((r) => {
      console.log(`  - User ${r.index} (${r.name}): ${r.error || "see mismatches"}`);

      if (r.fieldErrors?.length) {
        console.log("    Field errors:");
        r.fieldErrors.forEach((e) => console.log(`      [${e.field}]: "${e.message}"`));
      }

      if (r.toasts?.filter(t => t.message?.toLowerCase().includes("error")).length) {
        console.log("    Error toasts:");
        r.toasts.forEach((t) => console.log(`      "${t.message}"`));
      }

      if (r.mismatches?.length) {
        console.log("    Mismatches:");
        r.mismatches.forEach((m) =>
          console.log(`      [${m.field}] expected="${m.expected}" got="${m.actual}"`)
        );
      }
    });
  }

  // ── print warnings (fallback selections) ──────────────────
  const allWarnings = results.flatMap((r) => r.warnings || []);
  if (allWarnings.length) {
    console.log("\nFallback warnings (dropdown had no match):");
    allWarnings.forEach((w) =>
      console.log(`  [${w.field}] expected="${w.expected}" used="${w.actual}"`)
    );
  }

  expect.soft(summary.failed, `${summary.failed} user(s) failed`).toBe(0);
});