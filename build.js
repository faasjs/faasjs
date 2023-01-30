/* eslint-disable @typescript-eslint/no-var-requires */
const globSync = require('glob').sync
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)
const writeFile = promisify(require('fs').writeFile)
const version = require('./package.json').version

async function run(cmd) {
  console.log(cmd)
  await exec(cmd, { stdio: 'inherit' })
}

async function build(path, dts = false) {
  const pkg = require(__dirname + '/' + path)
  pkg.version = version
  if (pkg.dependencies) {
    for (const name of Object.keys(pkg.dependencies)) {
      if (name.startsWith('@faasjs/'))
        pkg.dependencies[name] = '^' + version
    }
  }
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
  await writeFile(path, JSON.stringify(pkg, null, 2) + '\n')

  if (pkg.scripts && pkg.scripts.build) {
    await run(`npm run build -w ${path.replace('/package.json', '')}`)
    if (dts && pkg.scripts['build:types'])
      await run(`npm run build:types -w ${path.replace('/package.json', '')}`)
  }
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

  await Promise.all(list.map(f => build(f)))
}

buildAll()

module.exports = { build }
