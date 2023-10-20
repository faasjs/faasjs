const globSync = require('glob').sync
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)
const { readFileSync, writeFileSync } = require('fs')

async function run(cmd) {
  console.log(cmd)
  await exec(cmd, { stdio: 'inherit' })
}

async function build(path) {
  const pkg = require(`${__dirname}/${path}`)

  if (!pkg.types) return

  await run(
    `npm run build:doc ${path.replace(
      '/package.json',
      '/src'
    )} -- --tsconfig ${path.replace(
      '/package.json',
      '/tsconfig.json'
    )} --out ${path.replace('/package.json', '/')}`
  )

  const modules = readFileSync(
    path.replace('/package.json', '/modules.md'),
    'utf8'
  )
    .toString()
    .replace(`# ${pkg.name}\n\n## Table of contents\n`, '')
    .replaceAll('(modules.md#', '(#')
  let readme = readFileSync(
    path.replace('/package.json', '/README.md'),
    'utf8'
  ).toString()

  if (readme.includes('## Modules')) {
    readme = readme.replace(/## Modules[\s\S]+/g, `## Modules\n${modules}`)
  } else readme += `\n## Modules\n\n${modules}`

  writeFileSync(path.replace('/package.json', '/README.md'), readme)

  await run(`rm ${path.replace('/package.json', '/modules.md')}`)

  const classes = globSync(path.replace('/package.json', '/classes/*.md'))

  if (classes.length)
    for (const file of classes)
      writeFileSync(
        file,
        readFileSync(file, 'utf8').replaceAll('(../modules.md#', '(../#')
      )
}

async function buildAll() {
  const list = globSync('packages/*/package.json').filter(
    path => !['/cli', '/create-faas-app'].includes(path)
  )

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
