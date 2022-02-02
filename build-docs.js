/* eslint-disable @typescript-eslint/no-var-requires */
const globSync = require('glob').sync
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)
const { existsSync } = require('fs')

async function run(cmd) {
  console.log(cmd)
  await exec(cmd, { stdio: 'inherit' })
}

async function build(path) {
  const pkg = require(__dirname + '/' + path)

  if (!pkg.types) return

  await run(`npm run build:doc ${path.replace('/package.json', '/src')} -- --out ${path.replace('/package.json', '/')}`)
}

async function buildAll() {
  const list = globSync('packages/*/package.json')

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

  for (const file of list) {
    await build(file)
  }
}

buildAll()

module.exports = { build }
