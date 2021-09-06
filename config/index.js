const dev = require('./dev/index');
const prod = require('./prod/index');

const env = process.env.NODE_ENV || 'dev';
const configs = {
  dev,
  prod
};
module.exports = configs[env];
