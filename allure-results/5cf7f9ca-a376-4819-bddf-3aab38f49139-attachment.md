# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: createUserProfile.spec.js >> User 2: Rohan Negi
- Location: tests\createUserProfile.spec.js:10:3

# Error details

```
Error: Step 1 fill failed: fill "middleName" failed: locator.fill: Test ended.
Call log:
  - waiting for locator('#employeeForm_middle_name')

```

# Test source

```ts
  1   | const { classify } = require("../utils/dataClassifier");
  2   | 
  3   | class FormEngine {
  4   |   constructor(page, ctx) {
  5   |     this.page = page;
  6   |     this.ctx = ctx;
  7   |     this.fields = {};
  8   |   }
  9   | 
  10  |   registerFields(fields) {
  11  |     this.fields = { ...this.fields, ...fields };
  12  |   }
  13  | 
  14  |   locator(selector) {
  15  |     return this.page.locator(selector);
  16  |   }
  17  | 
  18  |   async fill(fieldKey, value) {
  19  |     const field = this.fields[fieldKey];
  20  |     if (!field) {
  21  |       throw new Error(
  22  |         `Field "${fieldKey}" is not registered. Did you call registerFields()?`
  23  |       );
  24  |     }
  25  | 
  26  |     const { selector, group } = field;
  27  | 
  28  |     try {
  29  |       const isProvided = value !== undefined && value !== null && value !== "";
  30  |       let effectiveValue;
  31  | 
  32  |       if (!isProvided) {
  33  |         effectiveValue = await this.page.locator(selector).inputValue();
  34  |         this.ctx.fallback[fieldKey] = effectiveValue;
  35  |       } else {
  36  |         await this.page.locator(selector).fill(String(value));
  37  |         effectiveValue = value;
  38  |       }
  39  | 
  40  |       this.ctx.setInput(group, fieldKey, effectiveValue);
  41  |       this.ctx.setFinal(fieldKey, effectiveValue);
  42  |       this.ctx.setGenerated(fieldKey, classify(effectiveValue, isProvided));
  43  | 
  44  |     } catch (err) {
  45  |       this.ctx.log(`fill [${fieldKey}]: ${err.message}`, "error");
> 46  |       throw new Error(`fill "${fieldKey}" failed: ${err.message}`);
      |             ^ Error: Step 1 fill failed: fill "middleName" failed: locator.fill: Test ended.
  47  |     }
  48  |   }
  49  | 
  50  |   async click(selector) {
  51  |     try {
  52  |       await this.page.locator(selector).click();
  53  |     } catch (err) {
  54  |       throw new Error(`click "${selector}" failed: ${err.message}`);
  55  |     }
  56  |   }
  57  | 
  58  |   async type(selector, value) {
  59  |     if (!value) return;
  60  |     try {
  61  |       const input = this.page.locator(selector);
  62  |       await input.fill("");
  63  |       await input.type(value);
  64  |     } catch (err) {
  65  |       throw new Error(`type "${selector}" failed: ${err.message}`);
  66  |     }
  67  |   }
  68  | 
  69  |   async press(key) {
  70  |     try {
  71  |       await this.page.keyboard.press(key);
  72  |     } catch (err) {
  73  |       throw new Error(`press "${key}" failed: ${err.message}`);
  74  |     }
  75  |   }
  76  | 
  77  |   async select(selector, value) {
  78  |     try {
  79  |       await this.page.locator(selector).click();
  80  |       const dropdown = this.page.locator(
  81  |         '[role="listbox"], .ant-select-dropdown'
  82  |       );
  83  |       await dropdown.waitFor({ state: "visible", timeout: 5000 });
  84  |       await this.page
  85  |         .locator('[role="option"]')
  86  |         .filter({ hasText: value })
  87  |         .first()
  88  |         .click();
  89  |     } catch (err) {
  90  |       throw new Error(`select "${selector}" → "${value}" failed: ${err.message}`);
  91  |     }
  92  |   }
  93  | 
  94  |   async pause(ms = 500) {
  95  |     await this.page.waitForTimeout(ms);
  96  |   }
  97  | 
  98  |   async captureToast() {
  99  |     try {
  100 |       const toast = this.page.locator(
  101 |         ".ant-message-notice-content, .ant-notification-notice-message"
  102 |       );
  103 |       const count = await toast.count();
  104 | 
  105 |       for (let i = 0; i < count; i++) {
  106 |         const message = (await toast.nth(i).innerText()).trim();
  107 |         if (!message) continue;
  108 | 
  109 |         // ← deduplicate: don't add same message twice
  110 |         const already = this.ctx.toasts.some((t) => t.message === message);
  111 |         if (!already) {
  112 |           this.ctx.addToast({ message });
  113 |           this.ctx.log(`Toast captured: "${message}"`, "info");
  114 |         }
  115 |       }
  116 | 
  117 |     } catch (err) {
  118 |       this.ctx.log(`captureToast failed: ${err.message}`, "warn");
  119 |       // ← don't re-throw — toast capture is best-effort, shouldn't fail the test
  120 |     }
  121 |   }
  122 | 
  123 |   async captureFieldErrors() {
  124 |     try {
  125 |       const errors = this.page.locator(".ant-form-item-explain-error"); // ← was this.form.page (bug)
  126 |       const count = await errors.count();
  127 | 
  128 |       for (let i = 0; i < count; i++) {
  129 |         const msg = (await errors.nth(i).innerText()).trim();
  130 |         if (!msg) continue;
  131 | 
  132 |         const fieldContainer = errors
  133 |           .nth(i)
  134 |           .locator('xpath=ancestor::div[contains(@class,"ant-form-item")]');
  135 | 
  136 |         const label = await fieldContainer
  137 |           .locator("label")
  138 |           .first()
  139 |           .innerText()
  140 |           .catch(() => "unknown");
  141 | 
  142 |         // ← deduplicate: don't add same field+message twice
  143 |         const already = this.ctx.fieldErrors.some(
  144 |           (e) => e.field === label && e.message === msg
  145 |         );
  146 |         if (!already) {
```