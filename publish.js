/* eslint-disable @typescript-eslint/no-var-requires */
const globSync = require('glob').sync
const execSync = require('child_process').execSync
const writeFileSync = require('fs').writeFileSync
const version = require('./package.json').version

function exec(cmd) {
  console.log(cmd)
  execSync(cmd, { stdio: 'inherit' })
}

async function publish(path) {
  return new Promise((res) => {
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
    res()
  })
}

async function publishAll() {
  await Promise.all(globSync('packages/*/package.json').map(publish))
  exec(`git commit -am 'release ${version}'`)
  exec(`git tag ${version}`)
  exec('git push && git push --tags')
}

publishAll()
