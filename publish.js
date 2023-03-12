/* eslint-disable @typescript-eslint/no-var-requires */
const globSync = require('glob').sync
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)
const version = require('./package.json').version

async function run(cmd) {
  console.log(cmd)
  await exec(cmd, { stdio: 'inherit' })
}

async function publish(path) {
  const pkg = require(__dirname + '/' + path)

  console.log(pkg.name)

  try {
    await run(`npm publish -w ${path.replace('/package.json', '')} --access public`)
  } catch (error) {
    console.warn(error)
  }
  try {
    await run(`npm dist-tag add ${pkg.name}@${version} beta`)
  } catch (error) {
    console.warn(error)
  }
}

async function publishAll() {
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
    await publish(`packages/${name}/package.json`)
    list.splice(list.indexOf(`packages/${name}/package.json`), 1)
  }

  await Promise.all(list.map(publish))
  // for (const item of list) {
  //   await publish(item)
  // }
  await run(`git commit -am 'release ${version}'`)
  await run(`git tag v${version}`)
  await run('git push && git push --tags')
}

publishAll()
