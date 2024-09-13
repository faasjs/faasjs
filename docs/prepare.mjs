import { execSync} from 'node:child_process'
import {dirname} from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { Glob } from "bun"

function run(cmd) {
  console.log(cmd)
  execSync(cmd, { stdio: 'inherit' })
}

const packages = new Glob('../packages/**/*.md').scanSync()

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

const files = new Glob('./doc/**/*.md').scanSync()

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

const images = new Glob('../images/**/*.md').scanSync()

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

const roots = new Glob('../*.md').scanSync()

console.log(roots)

for (const file of roots) {
  if (file === '../README.md') continue
  run(`cp ${file} ${file.replace('../', './')}`)
}

// Fix modules' links
for (const file of [
  './doc/react/interfaces/FaasDataWrapperProps.md',
  './doc/react/interfaces/FaasReactClientInstance.md',
  './doc/vue-plugin/interfaces/FaasVuePluginOptions.md'
]) {
  writeFileSync(file, readFileSync(file, 'utf-8').toString()
  .replaceAll('../modules.md#faasaction', '../type-aliases/FaasAction.md')
  .replaceAll('../modules.md#faasparams', '../type-aliases/FaasParams.md')
  .replaceAll('../modules.md#faasdata', '../type-aliases/FaasData.md')
  .replaceAll('../modules.md#options', '../type-aliases/Options.md')
)
}
