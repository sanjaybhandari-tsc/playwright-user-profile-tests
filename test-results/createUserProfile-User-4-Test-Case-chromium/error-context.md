# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: createUserProfile.spec.js >> User 4: Test Case
- Location: tests\createUserProfile.spec.js:10:3

# Error details

```
Error: Drawer failed to open: goto() failed: page.goto: net::ERR_TIMED_OUT at https://dev.collectivwork.com/employee-management
Call log:
  - navigating to "https://dev.collectivwork.com/employee-management", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "This site can’t be reached" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - strong [ref=e9]: dev.collectivwork.com
      - text: took too long to respond.
    - generic [ref=e10]:
      - paragraph [ref=e11]: "Try:"
      - list [ref=e12]:
        - listitem [ref=e13]: Checking the connection
        - listitem [ref=e14]:
          - link "Checking the proxy and the firewall" [ref=e15] [cursor=pointer]:
            - /url: "#buttons"
        - listitem [ref=e16]:
          - link "Running Windows Network Diagnostics" [ref=e17] [cursor=pointer]:
            - /url: javascript:diagnoseErrors()
    - generic [ref=e18]: ERR_TIMED_OUT
  - generic [ref=e19]:
    - button "Reload" [ref=e21] [cursor=pointer]
    - button "Details" [ref=e22] [cursor=pointer]
```

# Test source

```ts
  1   | const { expect } = require("@playwright/test");
  2   | class CreateUserPage {
  3   |   constructor(page) {
  4   |     this.page = page;
  5   | 
  6   |     this.selectors = {
  7   |       employeeTab: "tab=Employee List",
  8   |       addEmployeeBtn: 'button:has-text("Add Employee")',
  9   |       nextBtn: 'button:has-text("Next")',
  10  |       backBtn: 'button:has-text("Back")',
  11  |     };
  12  |   }
  13  | 
  14  |   async goto() {
  15  |     try {
  16  |       await this.page.goto("/employee-management");
  17  |       await this.page.waitForLoadState("domcontentloaded");
  18  | 
  19  |       const employeeTab = this.page.getByRole("tab", { name: "Employee List" });
  20  |       await employeeTab.waitFor({ state: "visible" });
  21  |       await employeeTab.click();
  22  | 
  23  |       const addBtn = this.page.getByRole("button", { name: "Add Employee" });
  24  |       await addBtn.waitFor({ state: "visible" });
  25  |       await addBtn.click();
  26  |     } catch (err) {
  27  |       throw new Error(`goto() failed: ${err.message}`);
  28  |     }
  29  |   }
  30  |   async goto() {
  31  |     try {
  32  |       await this.page.goto("/employee-management");
  33  |       // await this.page.waitForTimeout(2000);
  34  |       // await this.page.reload();
  35  |       // const employeeTab = this.page.getByRole("tab", { name: "Employee List" });
  36  |       // await employeeTab.waitFor();
  37  |       // await employeeTab.click();
  38  |       const employeeTab = this.page.getByRole("tab", { name: "Employee List" });
  39  |       await employeeTab.click();
  40  | 
  41  |       // const addBtn = this.page.getByRole("button", { name: "Add Employee" });
  42  |       // await addBtn.waitFor();
  43  |       // await addBtn.click();
  44  |       const addBtn = this.page.getByRole("button", { name: "Add Employee" });
  45  |       await addBtn.click();
  46  |     } catch (err) {
> 47  |       throw new Error(`goto() failed: ${err.message}`);
      |             ^ Error: Drawer failed to open: goto() failed: page.goto: net::ERR_TIMED_OUT at https://dev.collectivwork.com/employee-management
  48  |     }
  49  |   }
  50  | 
  51  |   async expectDrawerOpen() {
  52  |     try {
  53  |       const drawer = this.page.locator(".ant-drawer-header");
  54  |       // await expect(drawer).toBeVisible();
  55  |       await expect(drawer).toBeVisible({ timeout: 10000 });
  56  |       await expect(drawer.getByText("Add Employee")).toBeVisible();
  57  |     } catch (err) {
  58  |       throw new Error(`Drawer did not open: ${err.message}`);
  59  |     }
  60  |   }
  61  | 
  62  |   //  NAVIGATION
  63  |   // async nextStep() {
  64  |   //   const btn = this.page.getByRole("button", { name: "Next" });
  65  |   //   // await btn.waitFor();
  66  |   //   await expect(btn).toBeVisible();
  67  |   //   await expect(btn).toBeEnabled();
  68  |   //   await btn.click();
  69  |   //   await this.page.waitForTimeout(500);
  70  |   // }
  71  |   async nextStep() {
  72  |     try {
  73  |       const btn = this.page.getByRole("button", { name: "Next" });
  74  |       await btn.waitFor({ state: "visible" });
  75  |       await expect(btn).toBeEnabled({ timeout: 5000 });
  76  |       await btn.click();
  77  |       await this.page.waitForLoadState("domcontentloaded");
  78  |       await this.page.waitForTimeout(500);
  79  |     } catch (err) {
  80  |       throw new Error(`nextStep() failed: ${err.message}`);
  81  |     }
  82  |   }
  83  |   async nextStep() {
  84  |     try {
  85  |       const btn = this.page.getByRole("button", { name: "Next" });
  86  |       await btn.waitFor({ state: "visible" });
  87  |       await expect(btn).toBeEnabled();
  88  |       await this.page.waitForLoadState("domcontentloaded"); // ← wait for DOM to settle
  89  |       await this.page.waitForTimeout(500); // ← small buffer for animations
  90  |       await btn.click();
  91  |       await this.page.waitForTimeout(500);
  92  |     } catch (err) {
  93  |       throw new Error(`nextStep() failed: ${err.message}`);
  94  |     }
  95  |   }
  96  | 
  97  | async prevStep() {
  98  |   try {
  99  |     const btn = this.page.getByRole("button", { name: "Back" });
  100 |     await btn.waitFor({ state: "visible" });
  101 |     await btn.click();
  102 |   } catch (err) {
  103 |     throw new Error(`prevStep() failed: ${err.message}`);
  104 |   }
  105 | }
  106 | 
  107 |   async createEmployee() {
  108 |     try {
  109 |       const btn = this.page.getByRole("button", { name: "Create" });
  110 |       await expect(btn).toBeVisible();
  111 |       await expect(btn).toBeEnabled();
  112 |       await btn.click();
  113 |       await this.page.waitForLoadState("domcontentloaded");
  114 |       await this.page.waitForTimeout(500);
  115 |     } catch (err) {
  116 |       throw new Error(`createEmployee() failed: ${err.message}`);
  117 |     }
  118 |   }
  119 |   async createEmployee() {
  120 |     try {
  121 |       const btn = this.page.getByRole("button", { name: "Create" });
  122 |       await expect(btn).toBeVisible();
  123 |       await expect(btn).toBeEnabled();
  124 |       await btn.click();
  125 |       await this.page.waitForTimeout(500);
  126 |     } catch (err) {
  127 |       throw new Error(`createEmployee() failed: ${err.message}`);
  128 |     }
  129 |   }
  130 | 
  131 |   async handleOnboardingEmailPopup(sendEmail = false) {
  132 |     const modal = this.page.locator(".ant-modal-content");
  133 |     await expect(modal).toBeVisible({ timeout: 10000 });
  134 | 
  135 |     if (sendEmail) {
  136 |       const checkbox = modal.locator('input[type="checkbox"]');
  137 |       await checkbox.check();
  138 |     }
  139 |     await modal.getByRole("button", { name: "Confirm" }).click();
  140 |     // ← wait specifically for success toast text
  141 |     const successToast = this.page.locator(".custom_toast_css_success");
  142 |     await successToast.waitFor({ state: "visible", timeout: 15000 });
  143 |     const message = (await successToast.innerText()).trim();
  144 |     if (!message.includes("Employee profile created successfully")) {
  145 |       throw new Error(`Unexpected toast: "${message}"`);
  146 |     }
  147 |     return message;
```