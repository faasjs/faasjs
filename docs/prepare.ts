import { execSync } from 'node:child_process'
import { globSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

function run(cmd: string) {
  console.log(cmd)
  execSync(cmd, { stdio: 'inherit' })
}

// Clear previously generated docs to avoid stale pages breaking VuePress build.
rmSync('./doc', { recursive: true, force: true })
run('mkdir -p ./doc')
writeFileSync('./doc/.keep', '')

const packages = globSync('../packages/**/*.md')

for (const file of packages) {
  const target = file.replace('../packages/', './doc/')
  run(`mkdir -p ${dirname(target)}`)
  run(`cp ${file} ${target}`)
}

writeFileSync(
  './doc/README.md',
  readFileSync(`../packages/README.md`, 'utf-8')
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

for (const file of images) {
  const target = file.replace('../images/', './doc/images/')
  run(`mkdir -p ${dirname(target)}`)
  run(`cp ${file} ${target}`)

  if (file === '../images/README.md') continue

  const content = readFileSync(target, 'utf-8').toString()

  writeFileSync(
    target,
    `[Images](../) / faasjs/${target.split('/')[3]}\n\n${content}`
  )
}

writeFileSync(
  './doc/images/README.md',
  readFileSync(`./doc/images/README.md`, 'utf-8')
    .toString()
    .replaceAll('https://faasjs.com', '')
)

const roots = globSync('../*.md')

for (const file of roots) {
  if (file === '../README.md') continue
  run(`cp ${file} ${file.replace('../', './')}`)
}
