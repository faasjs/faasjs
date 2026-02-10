import { spawnSync } from 'node:child_process'
import { existsSync, realpathSync } from 'node:fs'
import { basename, delimiter, join } from 'node:path'

function isBunBinary(binaryPath: string): boolean {
  try {
    const realPath = realpathSync(binaryPath)

    return basename(realPath).toLowerCase().startsWith('bun')
  } catch {
    return false
  }
}

function findNodeBinary(): string | null {
  if (!process.versions.bun) return process.execPath

  const pathValue = process.env.PATH || ''
  const binName = process.platform === 'win32' ? 'node.exe' : 'node'

  for (const dir of pathValue.split(delimiter)) {
    if (!dir) continue

    const candidate = join(dir, binName)

    if (!existsSync(candidate)) continue
    if (isBunBinary(candidate)) continue

    return candidate
  }

  return null
}

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

const nodeBinary = findNodeBinary()

if (!nodeBinary) {
  console.error('Cannot find a Node.js binary that is not Bun in PATH.')
  console.error('Please install Node.js and ensure it is available in PATH.')
  process.exit(1)
}

const userArgs = process.argv.slice(2)

if (userArgs.length === 0) {
  const buildAllDocsScript = join(process.cwd(), 'build-docs.cjs')

  if (!existsSync(buildAllDocsScript)) {
    console.error(`Cannot find docs build script: ${buildAllDocsScript}`)
    process.exit(1)
  }

  const fallback = spawnSync(nodeBinary, [buildAllDocsScript], {
    stdio: 'inherit',
    env: process.env,
  })

  if (fallback.error) {
    console.error(fallback.error)
    process.exit(1)
  }

  process.exit(fallback.status ?? 1)
}

const result = spawnSync(nodeBinary, [typedocCli, ...userArgs], {
  stdio: 'inherit',
  env: process.env,
})

if (result.error) {
  console.error(result.error)
  process.exit(1)
}

process.exit(result.status ?? 1)
