const globSync = require('glob').globSync
const execSync = require('child_process').execSync
const dirname = require('path').dirname
const { readFileSync, writeFileSync } = require('fs')

function run(cmd) {
  console.log(cmd)
  execSync(cmd, { stdio: 'inherit' })
}

const packages = globSync('../packages/**/*.md')

console.log(packages)
for (const file of packages) {
  const target = file.replace('../packages/', './doc/')
  run(`mkdir -p ${dirname(target)} &`)
  run(`cp ${file} ${target}`)
}

writeFileSync(
  './doc/README.md',
  readFileSync(`${__dirname}/../packages/README.md`, 'utf-8')
    .toString()
    .replaceAll('https://github.com/faasjs/faasjs/tree/main/packages/', '/doc/')
)

const images = globSync('../images/**/*.md')

console.log(images)
for (const file of images) {
  const target = file.replace('../images/', './doc/images/')
  run(`mkdir -p ${dirname(target)} &`)
  run(`cp ${file} ${target}`)
}

writeFileSync(
  './doc/images/README.md',
  readFileSync(`${__dirname}/doc/images/README.md`, 'utf-8')
    .toString()
    .replaceAll('https://faasjs.com', '')
)

const roots = globSync('../*.md')

console.log(roots)

for (const file of roots) {
  if (file === '../README.md') continue
  run(`cp ${file} ${file.replace('../', './')}`)
}
