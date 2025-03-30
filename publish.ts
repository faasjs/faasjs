import { execSync } from 'node:child_process'
import { globSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function loadJson(path: string) {
  return JSON.parse(readFileSync(path).toString())
}

const version = loadJson('./package.json').version
const dependencyVersion = `>=${version}`

const channel = version.includes('beta') ? 'beta' : 'stable'

function run(cmd: string) {
  console.log(cmd)
  execSync(cmd, { stdio: 'inherit' })
}

function publish(path: string) {
  const pkg = loadJson(`${__dirname}/${path}`)

  console.log(pkg.name)

  pkg.version = version

  for (const type of [
    'dependencies',
    'peerDependencies',
    'devDependencies',
    'optionalDependencies',
  ])
    if (pkg[type])
      for (const name of Object.keys(pkg[type]))
        if (name.startsWith('@faasjs/')) pkg[type][name] = dependencyVersion

  writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`)

  try {
    if (channel === 'stable') {
      run(`npm publish -w ${path.replace('/package.json', '')} --access public`)
      run(`npm dist-tag add ${pkg.name}@${version} stable`)
    } else
      run(
        `npm publish -w ${path.replace('/package.json', '')} --access public --tag ${channel}`
      )
  } catch (error) {
    console.warn(error)
  }
}

const list = globSync('packages/*/package.json')

for (const item of list) {
  publish(item)
}

run('npm install --force')
run('git add .')
run(`git commit -am 'release ${version}'`)
run(`git tag v${version}`)
run('git push && git push --tags')
