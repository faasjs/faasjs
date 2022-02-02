/* eslint-disable @typescript-eslint/no-var-requires */
const globSync = require('glob').sync
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)

async function run(cmd) {
  console.log(cmd)
  await exec(cmd, { stdio: 'inherit' })
}

async function build(path, dts = false) {
  const pkg = require(__dirname + '/' + path)

  await run(`npm run build:doc ${path.replace('/package.json', '/src')} --out docs/doc/${pkg.name.replace('@faasjs/', '')}`)
}

async function buildAll() {
  const list = globSync('packages/*/package.json')

  await Promise.all(list.map(f => build(f)))
}

buildAll()

module.exports = { build }
