/* eslint-disable @typescript-eslint/no-var-requires */
const globSync = require('glob').sync
const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)
const dirname = require('path').dirname
const { readFileSync, writeFileSync } = require('fs')

async function run(cmd) {
  console.log(cmd)
  await exec(cmd, { stdio: 'inherit' })
}

async function buildAll() {
  const list = globSync('../packages/**/*.md')

  console.log(list)
  for (const file of list) {
    const target = file.replace('../packages/', './doc/')
    await run(`mkdir -p ${dirname(target)} &`)
    await run(`cp ${file} ${target}`)
  }

  writeFileSync('./doc/README.md',
    readFileSync(__dirname + '/../packages/README.md', 'utf-8')
      .toString()
      .replaceAll('https://github.com/faasjs/faasjs/tree/main/packages/', '/doc/')
  )
}

buildAll()
