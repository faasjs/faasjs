import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const typedocCli = join(
  process.cwd(),
  'node_modules',
  'typedoc',
  'bin',
  'typedoc'
)

if (!existsSync(typedocCli)) {
  console.error(`Cannot find TypeDoc CLI: ${typedocCli}`)
  console.error('Please run npm install first.')
  process.exit(1)
}

const userArgs = process.argv.slice(2)

if (userArgs.length === 0) {
  const buildAllDocsScript = join(process.cwd(), 'build-docs.cjs')

  if (!existsSync(buildAllDocsScript)) {
    console.error(`Cannot find docs build script: ${buildAllDocsScript}`)
    process.exit(1)
  }

  const fallback = spawnSync('node', [buildAllDocsScript], {
    stdio: 'inherit',
    env: process.env,
  })

  if (fallback.error) {
    console.error(fallback.error)
    process.exit(1)
  }

  process.exit(fallback.status ?? 1)
}

const result = spawnSync('node', [typedocCli, ...userArgs], {
  stdio: 'inherit',
  env: process.env,
})

if (result.error) {
  console.error(result.error)
  process.exit(1)
}

process.exit(result.status ?? 1)
