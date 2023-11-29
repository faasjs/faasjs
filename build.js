const globSync = require('glob').sync
const exec = require('child_process').execSync
const writeFile = require('fs').writeFileSync
const version = require('./package.json').version

async function run(cmd) {
  console.log(cmd)
  await exec(cmd, { stdio: 'inherit' })
}

async function build(path) {
  const pkg = require(`${__dirname}/${path}`)
  pkg.version = version
  if (pkg.dependencies) {
    for (const name of Object.keys(pkg.dependencies)) {
      if (name.startsWith('@faasjs/')) pkg.dependencies[name] = `^${version}`
    }
  }
  if (pkg.devDependencies) {
    for (const name of Object.keys(pkg.devDependencies)) {
      if (name.startsWith('@faasjs/')) pkg.devDependencies[name] = `^${version}`
    }
  }
  if (pkg.engines) {
    pkg.engines = {
      node: '>=20.0.0',
      npm: '>=10.0.0',
    }
  }
  await writeFile(path, `${JSON.stringify(pkg, null, 2)}\n`)

  if (pkg.scripts?.build) {
    await run(`npm run build -w ${path.replace('/package.json', '')}`)
  }
}

async function buildAll() {
  const list = globSync('packages/*/package.json')

  for (const name of [
    'browser',
    'react',
    'ant-design',
    'logger',
    'deep_merge',
    'ts-transform',
    'func',
    'load',
    'http',
    'test',
    'cloud_function',
    'deployer',
    'request',
    'server',
  ]) {
    await build(`packages/${name}/package.json`)
    list.splice(list.indexOf(`packages/${name}/package.json`), 1)
  }

  for (const name of list) await build(name)
}

buildAll()

module.exports = { build }
