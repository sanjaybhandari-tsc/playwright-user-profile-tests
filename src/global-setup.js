const fs = require('fs');
const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
const config = require('./config');
require("dotenv").config({
  path: `.env.${process.env.TEST_ENV || "dev"}`,
});

async function globalSetup() {
  const env = process.env.TEST_ENV || 'dev';
  // Load env FIRST
  dotenv.config({ path: `.env.${env}` });
  const storagePath = `storageState.${env}.json`;
  //Skip login
  if (fs.existsSync(storagePath)) {
    console.log(`Using existing session: ${storagePath}`);
    return;
  }
  console.log('Performing fresh login...');
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`${config.baseURL}/login`);
  //Clean + reliable
  await page.fill('input[name="email"]', config.credentials.email);
  await page.fill('input[name="password"]', config.credentials.password);
  await Promise.all([
    page.waitForURL('**/dashboard'),
    page.getByRole('button', { name: /sign in/i }).click(),
  ]);
  await page.context().storageState({ path: storagePath });
  await browser.close();
  console.log('Login successful, session saved');
}

module.exports = globalSetup;