import { execSync } from 'node:child_process'
import { globSync, readFileSync, writeFileSync } from 'node:fs'

function run(cmd: string) {
  console.log(cmd)
  execSync(cmd, { stdio: 'inherit' })
}

function build(path: string) {
  console.log(path)
  const pkg = JSON.parse(readFileSync(path).toString())

  if (!pkg.types) return

  const packagePath = path.replace('/package.json', '')

  run(
    `rm -rf ${packagePath}/classes ${packagePath}/functions ${packagePath}/interfaces ${packagePath}/type-aliases ${packagePath}/modules ${packagePath}/variables`,
  )

  const intentionallyNotExportedArgs =
    packagePath === 'packages/types'
      ? ' --intentionallyNotExported FaasActions --intentionallyNotExported FaasEvents'
      : ''

  run(
    `npm exec typedoc -- ${packagePath}/src/index.ts --tsconfig ${packagePath}/tsconfig.json --out ${path.replace('/package.json', '/')}${intentionallyNotExportedArgs}`,
  )

  const files = globSync(path.replace('/package.json', '/**/*.md'))

  for (const file of files) {
    const content = readFileSync(file, 'utf8').toString()
    if (content.includes('***')) writeFileSync(file, content.replaceAll('\n***\n', ''))
  }
}

function buildAll() {
  const list = globSync('packages/*/package.json').filter(
    (path: string) => !['/cli', '/create-faas-app'].includes(path),
  )

  for (const file of list) {
    build(file)
  }
}
console.log('process.argv[2]', process.argv[2])
if (process.argv[2]) build(`${process.argv[2]}/package.json`)
else buildAll()
