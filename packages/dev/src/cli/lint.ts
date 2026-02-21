import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { createMain, parseCommonCliArgs, printVersion } from './shared'

type PackageJSON = {
  bin?: string | Record<string, string>
}

const HelpText = `Run formatter and lint checks with Oxc shared configs.

Usage:
  faas lint [options]

Options:
  --root <path>      Project root path (default: process.cwd())
  -h, --help         Show help
  -v, --version      Show version
`

function resolvePackageJsonPath(
  projectRoot: string,
  packageName: string
): string {
  const requireFromProject = createRequire(resolve(projectRoot, 'package.json'))
  let packageEntryPath = ''

  try {
    packageEntryPath = requireFromProject.resolve(packageName)
  } catch {
    throw Error(
      `[faas lint] Missing dependency: ${packageName}. Please install ${packageName} in your project.`
    )
  }

  let currentPath = dirname(packageEntryPath)
  let packageJsonPath = ''

  while (true) {
    const candidate = join(currentPath, 'package.json')

    if (existsSync(candidate)) {
      packageJsonPath = candidate
      break
    }

    const parentPath = dirname(currentPath)

    if (parentPath === currentPath) break

    currentPath = parentPath
  }

  if (!packageJsonPath)
    throw Error(
      `[faas lint] Invalid dependency: Cannot find package.json for ${packageName}.`
    )

  return packageJsonPath
}

function resolveBinPath(
  projectRoot: string,
  packageName: string,
  binName: string
): string {
  const packageJsonPath = resolvePackageJsonPath(projectRoot, packageName)

  const packageJSON = JSON.parse(
    readFileSync(packageJsonPath, 'utf8')
  ) as PackageJSON
  const bin =
    typeof packageJSON.bin === 'string'
      ? packageJSON.bin
      : packageJSON.bin?.[binName]

  if (!bin)
    throw Error(
      `[faas lint] Invalid dependency: ${packageName} does not expose "${binName}" bin.`
    )

  return resolve(dirname(packageJsonPath), bin)
}

function resolveSharedConfigPath(
  projectRoot: string,
  configFileName: string
): string {
  const devPackageJsonPath = resolvePackageJsonPath(projectRoot, '@faasjs/dev')
  const configPath = resolve(
    dirname(devPackageJsonPath),
    'configs',
    configFileName
  )

  if (!existsSync(configPath))
    throw Error(`[faas lint] Missing shared config: ${configPath}`)

  return configPath
}

function runNodeBin(
  projectRoot: string,
  command: string,
  binPath: string,
  args: string[]
): void {
  try {
    execFileSync(process.execPath, [binPath, ...args], {
      cwd: projectRoot,
      stdio: 'inherit',
    })
  } catch {
    throw Error(`[faas lint] ${command} failed`)
  }
}

export async function run(args: string[]): Promise<number> {
  const { mode, options, rest } = parseCommonCliArgs(args, 'faas lint')

  if (mode === 'help') {
    console.log(HelpText)
    return 0
  }

  if (mode === 'version') return printVersion()

  if (rest.length) throw Error(`[faas lint] Unexpected argument: ${rest[0]}`)

  const projectRoot = options.root ?? process.cwd()
  const oxlintBinPath = resolveBinPath(projectRoot, 'oxlint', 'oxlint')
  const oxlintConfigPath = resolveSharedConfigPath(
    projectRoot,
    'oxlint.base.json'
  )

  runNodeBin(projectRoot, 'oxlint', oxlintBinPath, [
    '-c',
    oxlintConfigPath,
    '--fix',
    '.',
  ])

  console.log('[faas lint] Done')

  return 0
}

export const main = createMain(run)
