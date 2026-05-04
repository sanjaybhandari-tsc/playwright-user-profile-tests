const { test, expect } = require("@playwright/test");
const users = require("../src/data/users.json");
const { reportCtxToPlaywright } = require("../src/utils/ctxReporter");
const { createUserFlow } = require("../src/flows/createUser.flow");
const { MasterDataPage } = require("../src/pages/MasterDataPage");
const { CTCBreakdownPage } = require("../src/pages/CTCBreakdownPage");

const results = [];


// ONE TEST PER USER
users.forEach((user, i) => {
  test(
    `User ${i + 1}: ${user.personalDetails?.firstName || "Unknown"} ${user.personalDetails?.lastName || ""}`.trim(),
    async ({ page }) => {
      test.setTimeout(300000);

      const userName =
        `${user.personalDetails?.firstName || "Unknown"} ${user.personalDetails?.lastName || ""}`.trim();

      const result = {
        index: i + 1,
        name: userName,
        employeeId: null,
        status: "FAIL",
        create: {
          status: "FAIL",
          mismatches: [],
          fieldErrors: [],
          toasts: [],
          error: null,
        },
        masterData: {
          status: "SKIP",
          scraped: {},
          mismatches: [],
          error: null,
        },
        ctcBreakdown: {
          status: "SKIP",
          scraped: {},
          mismatches: [],
          error: null,
        },
      };

      let ctx; 

      // PHASE 1 — Create user
      await test.step("Phase 1: Create user", async () => {
        try {
          ctx = await createUserFlow(page, user, test);
        } catch (err) {
          ctx = err.ctx || ctx;

          await test.info().attach(`User-${i + 1}-partial-ctx`, {
            body: JSON.stringify(
              ctx?.toJSON?.() || { error: err.message },
              null,
              2,
            ),
            contentType: "application/json",
          });

          if (ctx) await reportCtxToPlaywright(test, test.info(), ctx, i + 1);

          result.create.error = err.message;
          result.create.mismatches = ctx?.mismatches || [];
          result.create.fieldErrors = ctx?.fieldErrors || [];
          result.create.toasts = ctx?.toasts || [];

          results.push(result);
          throw err; 
        }
        await test.info().attach(`User-${i + 1}-full-ctx`, {
          body: JSON.stringify(ctx.toJSON(), null, 2),
          contentType: "application/json",
        });

        await reportCtxToPlaywright(test, test.info(), ctx, i + 1);

        result.employeeId = ctx.generated.employeeId;
        result.create.mismatches = ctx.mismatches;
        result.create.fieldErrors = ctx.fieldErrors;
        result.create.toasts = ctx.toasts;

        // ── hard asserts ─────────────────────────────────────
        await test.step("Assert: success toast received", async () => {
          expect(
            ctx.generated.successToast,
            `User ${i + 1}: success toast not shown — user was NOT created`,
          ).toBeTruthy();
        });

        await test.step("Assert: employee ID generated", async () => {
          expect(
            ctx.generated.employeeId,
            `User ${i + 1}: employeeId was not captured`,
          ).toBeTruthy();
        });

        // ── soft asserts ─────────────────────────────────────
        await test.step("Assert: no field errors", async () => {
          if (ctx.fieldErrors.length) {
            const lines = ctx.fieldErrors.map(
              (e) => `  [${e.field}]: "${e.message}"`,
            );
            expect
              .soft(
                ctx.fieldErrors.length,
                `Field errors:\n${lines.join("\n")}`,
              )
              .toBe(0);
          }
        });

        await test.step("Assert: no error toasts", async () => {
          const bad = ctx.toasts.filter((t) =>
            ["error", "failed", "invalid", "required"].some((k) =>
              t.message?.toLowerCase().includes(k),
            ),
          );
          if (bad.length) {
            const lines = bad.map((t) => `  "${t.message}"`);
            expect
              .soft(bad.length, `Error toasts:\n${lines.join("\n")}`)
              .toBe(0);
          }
        });

        await test.step("Assert: no field mismatches", async () => {
          if (ctx.hasMismatches()) {
            const lines = ctx.mismatches.map(
              (m) =>
                `  [${m.field}] expected="${m.expected}" got="${m.actual}" (${m.source})`,
            );
            expect
              .soft(ctx.mismatches.length, `Mismatches:\n${lines.join("\n")}`)
              .toBe(0);
          }
        });

        result.create.status = "PASS";
      });

      // PHASE 2 — Verify Master Data table
      await test.step("Phase 2: Verify Master Data", async () => {
        const masterPage = new MasterDataPage(page);

        try {
          await test.step("Navigate to Employee List", async () => {
            await masterPage.goto();
          });

          await test.step(`Filter by employeeId: ${ctx.generated.employeeId}`, async () => {
            const filterName = `${[
              ctx.final?.firstName,
              ctx.final?.middleName,
              ctx.final?.lastName,
            ]
              .filter(Boolean)
              .join(" ")} (${ctx.generated?.employeeId})`;
            // const filterName = `${ctx.final.firstName} ${ctx.final.middleName} ${ctx.final.lastName} (${ctx.generated.employeeId})`;
            result.masterData.scraped =
              await masterPage.filterAndScrape(filterName);

            await test.info().attach(`User-${i + 1}-master-scraped`, {
              body: JSON.stringify(result.masterData.scraped, null, 2),
              contentType: "application/json",
            });

            console.log(
              `[Master Data] User ${i + 1}:`,
              result.masterData.scraped,
            );
          });

          await test.step("Compare scraped row against submitted input", async () => {
            result.masterData.mismatches = masterPage.compare(
              result.masterData.scraped,
              ctx,
            );

            if (result.masterData.mismatches.length) {
              const lines = result.masterData.mismatches.map(
                (m) =>
                  `  [${m.field}] expected="${m.expected}" got="${m.actual}"`,
              );
              expect
                .soft(
                  result.masterData.mismatches.length,
                  `Master data mismatches:\n${lines.join("\n")}`,
                )
                .toBe(0);
            }
          });

          result.masterData.status = "PASS";
        } catch (err) {
          result.masterData.status = "FAIL";
          result.masterData.error = err.message;
          throw err;
        }
      });

      // PHASE 3 — Verify CTC Breakdown table
      await test.step("Phase 3: Verify CTC Breakdown", async () => {
        const ctcPage = new CTCBreakdownPage(page);

        try {
          await test.step("Navigate to CTC Breakdown page", async () => {
            await ctcPage.goto();
          });

          await test.step(`Filter by employeeId: ${ctx.generated.employeeId}`, async () => {
            // const filterName = `${ctx.final.firstName} (${ctx.generated.employeeId})`;
            const filterName = `${[
              ctx.final?.firstName,
              ctx.final?.middleName,
              ctx.final?.lastName,
            ]
              .filter(Boolean)
              .join(" ")} (${ctx.generated?.employeeId})`;
            result.ctcBreakdown.scraped =
              await ctcPage.filterAndScrape(filterName);
            // result.ctcBreakdown.scraped = await ctcPage.filterAndScrape(ctx.generated.employeeId);

            await test.info().attach(`User-${i + 1}-ctc-scraped`, {
              body: JSON.stringify(result.ctcBreakdown.scraped, null, 2),
              contentType: "application/json",
            });

            console.log(
              `[CTC Breakdown] User ${i + 1}:`,
              result.ctcBreakdown.scraped,
            );
          });

          await test.step("Compare scraped CTC against submitted finance input", async () => {
            result.ctcBreakdown.mismatches = ctcPage.compare(
              result.ctcBreakdown.scraped,
              ctx,
            );

            if (result.ctcBreakdown.mismatches.length) {
              const lines = result.ctcBreakdown.mismatches.map(
                (m) =>
                  `  [${m.field}] expected="${m.expected}" got="${m.actual}"`,
              );
              expect
                .soft(
                  result.ctcBreakdown.mismatches.length,
                  `CTC mismatches:\n${lines.join("\n")}`,
                )
                .toBe(0);
            }
          });

          result.ctcBreakdown.status = "PASS";
        } catch (err) {
          result.ctcBreakdown.status = "FAIL";
          result.ctcBreakdown.error = err.message;
          throw err;
        }
      });

      // ── All 3 phases passed ─────────────────────────────────
      result.status = "PASS";
      results.push(result);
    },
  );
});


// BULK SUMMARY — runs after all user tests
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


  if (failed.length) {
    console.log("\nFailed users:");
    failed.forEach((r) => {
      console.log(`\n  User ${r.index} (${r.name}):`);

      // Phase 1
      if (r.create.status === "FAIL") {
        console.log(
          `    [Phase 1 - Create] FAIL: ${r.create.error || "see below"}`,
        );
        r.create.fieldErrors?.forEach((e) =>
          console.log(`      Field error [${e.field}]: "${e.message}"`),
        );
        r.create.mismatches?.forEach((m) =>
          console.log(
            `      Mismatch [${m.field}] expected="${m.expected}" got="${m.actual}"`,
          ),
        );
      }

      // Phase 2
      if (r.masterData.status === "FAIL") {
        console.log(
          `    [Phase 2 - Master Data] FAIL: ${r.masterData.error || "see below"}`,
        );
        r.masterData.mismatches?.forEach((m) =>
          console.log(
            `      [${m.field}] expected="${m.expected}" got="${m.actual}"`,
          ),
        );
      } else if (r.masterData.status === "SKIP") {
        console.log(`    [Phase 2 - Master Data] SKIPPED — create failed`);
      }

      // Phase 3
      if (r.ctcBreakdown.status === "FAIL") {
        console.log(
          `    [Phase 3 - CTC Breakdown] FAIL: ${r.ctcBreakdown.error || "see below"}`,
        );
        r.ctcBreakdown.mismatches?.forEach((m) =>
          console.log(
            `      [${m.field}] expected="${m.expected}" got="${m.actual}"`,
          ),
        );
      } else if (r.ctcBreakdown.status === "SKIP") {
        console.log(
          `    [Phase 3 - CTC Breakdown] SKIPPED — earlier phase failed`,
        );
      }
    });
  }

  // ── Fallback warnings ────────────────────────────────────
  const allWarnings = results.flatMap((r) =>
    (r.create?.mismatches || []).filter(
      (m) => m.actual === "not found in dropdown",
    ),
  );
  if (allWarnings.length) {
    console.log("\nFallback warnings (dropdown had no match):");
    allWarnings.forEach((w) =>
      console.log(`  [${w.field}] expected="${w.expected}" used="${w.actual}"`),
    );
  }

  expect.soft(failed.length, `${failed.length} user(s) failed`).toBe(0);
});
