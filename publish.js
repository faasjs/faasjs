/* eslint-disable @typescript-eslint/no-var-requires */
const globSync = require('glob').sync
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)
const version = require('./package.json').version
const build = require('./build.js').build

async function run(cmd) {
  console.log(cmd)
  await exec(cmd, { stdio: 'inherit' })
}

async function publish(path) {
  const pkg = require(__dirname + '/' + path)
  await build(path)
  await run(`npm publish -w ${path.replace('/package.json', '')} --access public`)
  await run(`npm dist-tag add ${pkg.name}@${version} beta`)
}

async function publishAll() {
  await Promise.all(globSync('packages/*/package.json').map(publish))
  await run(`git commit -am 'release ${version}'`)
  await run(`git tag v${version}`)
  await run('git push && git push --tags')
}

publishAll()
