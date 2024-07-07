const path = require('path');
const execSync = require('child_process').execSync;

let karmaConfig = path.resolve(__dirname, 'karma.conf.js');

execSync(`karma start ${karmaConfig}`, {
  env: process.env,
  stdio: 'inherit'
});
