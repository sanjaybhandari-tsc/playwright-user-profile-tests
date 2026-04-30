const { expect } = require("@playwright/test");
async function reportCtxToPlaywright(test, testInfo, ctx, userIndex) {
  const json = ctx.toJSON();
  for (const [group, fields] of Object.entries(json.input)) {
    if (!Object.keys(fields).length) continue;

    await test.step(`${group.toUpperCase()} fields`, async () => {
      for (const [field, expected] of Object.entries(fields)) {
        const mismatch = json.mismatches.find((m) => m.field === field);

        await test.step(`${field}`, async () => {
          if (mismatch) {
            expect
              .soft(
                mismatch.actual,
                `${field}: expected "${JSON.stringify(expected)}" but got "${JSON.stringify(mismatch.actual)}" [source: ${mismatch.source}]`,
              )
              .toBe(expected);
          } else {
            expect
              .soft(
                expected,
                `${field}: matched "${JSON.stringify(expected)}"`,
              )
              .toBe(expected);
          }
        });
      }
    });
  }

  // ── Fallbacks — SOFT ───────────────────────────────────
  if (Object.keys(json.fallback).length) {
    await test.step(`Fallbacks (UI auto-filled)`, async () => {
      for (const [field, value] of Object.entries(json.fallback)) {
        await test.step(`${field}: "${value}"`, async () => {
          expect.soft(value).toBeDefined(); // ← SOFT
        });
      }
    });
  }

  // ── Error toasts — HARD ────────────────────────────────
  if (json.toasts?.length) {
    await test.step(` Toasts`, async () => {
      for (const toast of json.toasts) {
        await test.step(toast.message, async () => {
          expect(
            // ← HARD
            toast.message,
            `Error toast detected: "${toast.message}"`,
          ).toBeFalsy();
        });
      }
    });
  }

  // ── Field errors — HARD ────────────────────────────────
  if (json.fieldErrors?.length) {
    await test.step(` Field Errors`, async () => {
      for (const err of json.fieldErrors) {
        await test.step(`${err.field}: ${err.message}`, async () => {
          expect(
            // ← HARD
            err.message,
            `Field error on "${err.field}": "${err.message}"`,
          ).toBeFalsy();
        });
      }
    });
  }

  // ── employeeId — SOFT ──────────────────────────────────
  await test.step(`employeeId captured`, async () => {
    expect
      .soft(
        // ← SOFT
        json.generated?.employeeId,
        `employeeId was not captured`,
      )
      .toBeDefined();
  });
}
module.exports = { reportCtxToPlaywright };
