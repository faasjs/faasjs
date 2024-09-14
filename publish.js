const exec = require('node:child_process').execSync
const { writeFileSync, globSync } = require('node:fs')
const version = require('./package.json').version

async function run(cmd) {
  console.log(cmd)
  await exec(cmd, { stdio: 'inherit' })
}

async function publish(path) {
  const pkg = require(`${__dirname}/${path}`)

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
    await run(
      `npm publish -w ${path.replace('/package.json', '')} --access public --tag canary`
    )
  } catch (error) {
    console.warn(error)
  }
  // try {
  //   await run(`npm dist-tag add ${pkg.name}@${version} stable`)
  // } catch (error) {
  //   console.warn(error)
  // }
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
