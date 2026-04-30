const fs   = require('fs');
const path = require('path');

const env     = process.env.NODE_ENV || 'dev';
const envFile = path.resolve(__dirname, `../.env.${env}`);

if (!fs.existsSync(envFile)) {
  console.warn(`[envLoader] Warning: "${envFile}" not found. Falling back to .env.dev`);
}

// Simple .env parser (no dotenv dependency needed)
try {
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  }
} catch (e) {
  console.error(`[envLoader] Could not load env file: ${e.message}`);
}
