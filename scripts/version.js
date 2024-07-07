const path = require('path');
const execSync = require('child_process').execSync;

const chalk = require('chalk');
const Confirm = require('prompt-confirm');
const jsonfile = require('jsonfile');
const semver = require('semver');

const rootDir = path.resolve(__dirname, '..');

function packageJson(packageName) {
  return path.join(rootDir, 'packages', packageName, 'package.json');
}

function invariant(cond, message) {
  if (!cond) throw new Error(message);
}

function ensureCleanWorkingDirectory() {
  let status = execSync(`git status --porcelain`)
    .toString()
    .trim();
  let lines = status.split('\n');
  invariant(
    lines.every(line => line === '' || line.startsWith('?')),
    'Working directory is not clean. Please commit or stash your changes.'
  );
}

function getNextVersion(currentVersion, givenVersion, prereleaseId) {
  invariant(
    givenVersion != null,
    `Missing next version. Usage: node version.js [nextVersion]`
  );

  if (/^pre/.test(givenVersion)) {
    invariant(
      prereleaseId != null,
      `Missing prerelease id. Usage: node version.js ${givenVersion} [prereleaseId]`
    );
  }

  let nextVersion = semver.inc(currentVersion, givenVersion, prereleaseId);

  invariant(nextVersion != null, `Invalid version specifier: ${givenVersion}`);

  return nextVersion;
}

async function prompt(question) {
  let confirm = new Confirm(question);
  let answer = await confirm.run();
  return answer;
}

async function getPackageVersion(packageName) {
  let file = packageJson(packageName);
  let json = await jsonfile.readFile(file);
  return json.version;
}

async function updatePackageConfig(packageName, transform) {
  let file = packageJson(packageName);
  let json = await jsonfile.readFile(file);
  transform(json);
  await jsonfile.writeFile(file, json, { spaces: 2 });
}

async function run() {
  try {
    let args = process.argv.slice(2);
    let givenVersion = args[0];
    let prereleaseId = args[1];

    // 0. Make sure the working directory is clean
    ensureCleanWorkingDirectory();

    // 1. Get the next version number
    let currentVersion = await getPackageVersion('history');
    let version = semver.valid(givenVersion);
    if (version == null) {
      version = getNextVersion(currentVersion, givenVersion, prereleaseId);
    }

    // 2. Confirm the next version number
    let answer = await prompt(
      `Are you sure you want to bump version ${currentVersion} to ${version}? [Yn] `
    );

    if (answer === false) return 0;

    // 3. Update history version
    await updatePackageConfig('history', config => {
      config.version = version;
    });
    console.log(chalk.green(`  Updated history to version ${version}`));

    // 4. Commit and tag
    execSync(`git commit --all --message="Version ${version}"`);
    execSync(`git tag -a -m "Version ${version}" v${version}`);
    console.log(chalk.green(`  Committed and tagged version ${version}`));
  } catch (error) {
    console.log();
    console.error(chalk.red(`  ${error.message}`));
    console.log();
    return 1;
  }

  return 0;
}

run().then(code => {
  process.exit(code);
});
