/* eslint-disable @typescript-eslint/no-var-requires */
const globSync = require('glob').sync
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)

async function run(cmd) {
  console.log(cmd)
  await exec(cmd, { stdio: 'inherit' })
}

async function build(path) {
  const pkg = require(__dirname + '/' + path)

  if (pkg.scripts && pkg.scripts['build:types']) {
    await run(`npm run build:types -w ${path.replace('/package.json', '')}`)
  }
}

async function buildAll() {
  const list = globSync('packages/*/package.json')
    .filter(path => !['/cli', '/create-faas-app'].includes(path))

  for (const name of [
    'browser',
    'logger',
    'deep_merge',
    'ts-transform',
    'func',
    'load',
    'http',
    'cloud_function',
    'deployer',
    'request',
  ]) {
    await build(`packages/${name}/package.json`)
    list.splice(list.indexOf(`packages/${name}/package.json`), 1)
  }

  await Promise.all(list.map(f => build(f)))
}

buildAll()

module.exports = { build }
