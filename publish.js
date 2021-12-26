/* eslint-disable @typescript-eslint/no-var-requires */
const globSync = require('glob').sync
const execSync = require('child_process').execSync
const writeFileSync = require('fs').writeFileSync
const version = require('./package.json').version

function exec(cmd) {
  console.log(cmd)
  execSync(cmd, { stdio: 'inherit' })
}

for (const path of globSync('packages/*/package.json')) {
  const pkg = require(__dirname + '/' + path)
  pkg.version = version
  if (pkg.peerDependencies) {
    for (const name of Object.keys(pkg.peerDependencies)) {
      if (name.startsWith('@faasjs/'))
        pkg.peerDependencies[name] = '^' + version
    }
  }
  if (pkg.devDependencies) {
    for (const name of Object.keys(pkg.devDependencies)) {
      if (name.startsWith('@faasjs/'))
        pkg.devDependencies[name] = '^' + version
    }
  }
  writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n')
  if (pkg.scripts && pkg.scripts.build)
    exec(`npm run build -w ${path.replace('/package.json', '')}`)
  exec(`npm publish -w ${path.replace('/package.json', '')} --access public`)
  exec(`npm dist-tag add ${pkg.name}@${pkg.version} beta`)
}
