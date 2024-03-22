const globSync = require('glob').globSync
const execSync = require('node:child_process').execSync
const dirname = require('node:path').dirname
const { readFileSync, writeFileSync } = require('node:fs')

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
    .replaceAll(
      /https:\/\/github.com\/faasjs\/faasjs\/tree\/main\/packages\/([^)]+)/g,
      (_, name) => `/doc/${name}/`
    )
)

const files = globSync('./doc/**/*.md')

for (const file of files) {
  if (file === 'doc/README.md') continue

  let content = readFileSync(file, 'utf8').toString()
  console.log(file)
  if (content.startsWith('# ')) {
    const title = content.split('\n')[0].replace('# ', '')
    content = `[Documents](../) / ${title}\n\n${content}`
  } else {
    content = `[Documents](../) / ${content}`
  }
  writeFileSync(file, content)
}

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
