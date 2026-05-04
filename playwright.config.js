const { defineConfig, devices } = require('@playwright/test');
require("dotenv").config();
const env = process.env.TEST_ENV || "dev";
require("dotenv").config({ path: `.env.${env}` });

module.exports = {
  globalSetup: require.resolve("./src/global-setup.js"),
  testDir: "./tests",
  timeout: 90_000,
  workers: 1, 

  use: {
    baseURL: process.env.BASE_URL,
    storageState: `storageState.${env}.json`,
    headless: false,
    trace: "on-first-retry",
    slowMo: 200,
    actionTimeout: 15000,
  },

  reporter: [
    ["html", { outputFolder: "reports/html", open: "always" }],
    ["json", { outputFile: "reports/json/results.json" }],
    ["list"],
  ],

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } }
  ],
};