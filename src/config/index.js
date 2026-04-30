require('dotenv').config();

const dev = require('./dev');
const prod = require('./prod');

const ENV = process.env.TEST_ENV || 'dev';

const configMap = { dev, prod };

const config = configMap[ENV];

config.credentials = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

module.exports = config;