const path = require('path');
const execSync = require('child_process').execSync;

let config = path.resolve(__dirname, 'rollup/history.config.js');

execSync(`rollup -c ${config}`, {
  env: process.env,
  stdio: 'inherit'
});
