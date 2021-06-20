/* eslint-disable @typescript-eslint/no-var-requires */
const globSync = require('glob').sync;
const execSync = require('child_process').execSync;

for (const pkg of globSync('packages/*/package.json').map(f => require('./' + f)))
  try {
    const cmd = `npm dist-tag add ${pkg.name}@${pkg.version} latest`;
    console.log(cmd);
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.error(error);
  }
