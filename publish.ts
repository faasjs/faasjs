import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, globSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function loadJson(path: string) {
  return JSON.parse(readFileSync(path).toString())
}

const version = loadJson('./package.json').version

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
    run(`npm dist-tag add ${pkg.name}@${version} stable`)
  } catch (error) {
    console.warn(error)
  }
}

async function publishAll() {
  const list = globSync('packages/*/package.json')

  // await Promise.all(list.map(publish))
  for (const item of list) {
    await publish(item)
  }
  await run('npm install')
  await run(`git commit -am 'release ${version}'`)
  await run(`git tag v${version}`)
  await run('git push && git push --tags')
}

publishAll()
