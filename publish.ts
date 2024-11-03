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

const channel = version.includes('beta') ? 'beta' : 'stable'

function run(cmd: string) {
  console.log(cmd)
  execSync(cmd, { stdio: 'inherit' })
}

function publish(path: string) {
  const pkg = loadJson(`${__dirname}/${path}`)

  console.log(pkg.name)

  pkg.version = version
  if (pkg.dependencies) {
    for (const name of Object.keys(pkg.dependencies)) {
      if (name.startsWith('@faasjs/')) pkg.dependencies[name] = version
    }
  }
  if (pkg.peerDependencies) {
    for (const name of Object.keys(pkg.peerDependencies)) {
      if (name.startsWith('@faasjs/')) pkg.peerDependencies[name] = version
    }
  }
  if (pkg.devDependencies) {
    for (const name of Object.keys(pkg.devDependencies)) {
      if (name.startsWith('@faasjs/')) pkg.devDependencies[name] = version
    }
  }
  writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`)

  try {
    run(`npm publish -w ${path.replace('/package.json', '')} --access public`)
  } catch (error) {
    console.warn(error)
  }
  try {
    run(`npm dist-tag add ${pkg.name}@${version} ${channel}`)
  } catch (error) {
    console.warn(error)
  }
}

const list = globSync('packages/*/package.json')

for (const item of list) {
  publish(item)
}

run('npm install')
run('git add .')
run(`git commit -am 'release ${version}'`)
run(`git tag v${version}`)
run('git push && git push --tags')
