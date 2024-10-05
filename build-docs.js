const execSync = require('node:child_process').execSync
const { readFileSync, writeFileSync, globSync } = require('node:fs')

function run(cmd) {
  console.log(cmd)
  execSync(cmd, { stdio: 'inherit' })
}

function build(path) {
  const pkg = require(`${__dirname}/${path}`)

  if (!pkg.types) return

  const packagePath = path.replace('/package.json', '')

  run(
    `rm -rf ${packagePath}/classes ${packagePath}/functions ${packagePath}/interfaces ${packagePath}/type-aliases ${packagePath}/modules ${packagePath}/variables`
  )

  run(
    `npm run build:doc ${packagePath}/src -- --tsconfig ${packagePath}/tsconfig.json --out ${path.replace('/package.json', '/')}`
  )

  const files = globSync(path.replace('/package.json', '/**/*.md'))

  for (const file of files) {
    const content = readFileSync(file, 'utf8').toString()
    if (content.includes('***'))
      writeFileSync(file, content.replaceAll('\n***\n', ''))
  }

  // const modules = readFileSync(
  //   path.replace('/package.json', '/modules.md'),
  //   'utf8'
  // )
  //   .toString()
  //   .replace(`# ${pkg.name}\n\n## Table of contents\n`, '')
  //   .replaceAll('(modules.md#', '(#')
  // let readme = readFileSync(
  //   path.replace('/package.json', '/README.md'),
  //   'utf8'
  // ).toString()

  // if (readme.includes('## Modules')) {
  //   readme = readme.replace(/## Modules[\s\S]+/g, `## Modules\n${modules}`)
  // } else readme += `\n## Modules\n\n${modules}`

  // writeFileSync(path.replace('/package.json', '/README.md'), readme)

  // await run(`rm ${path.replace('/package.json', '/modules.md')}`)

  // const classes = globSync(path.replace('/package.json', '/classes/*.md'))

  // if (classes.length)
  //   for (const file of classes)
  //     writeFileSync(
  //       file,
  //       readFileSync(file, 'utf8').replaceAll('(../modules.md#', '(../#')
  //     )
}

function buildAll() {
  const list = globSync('packages/*/package.json').filter(
    path => !['/cli', '/create-faas-app'].includes(path)
  )

  for (const file of list) {
    build(file)
  }
}

if (process.argv[2]) build(`packages/${process.argv[2]}/package.json`)
else buildAll()

module.exports = { build }
