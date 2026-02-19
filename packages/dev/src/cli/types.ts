import { generateFaasTypes } from '../typegen'
import { createMain, parseCommonCliArgs, printVersion } from './shared'

const HelpText = `Generate FaasJS API/event type declarations.

Usage:
  faas types [options]

Options:
  --root <path>      Project root path (default: process.cwd())
  -h, --help         Show help
  -v, --version      Show version
`

export async function run(args: string[]): Promise<number> {
  const { mode, options, rest } = parseCommonCliArgs(args, 'faas types')

  if (mode === 'help') {
    console.log(HelpText)
    return 0
  }

  if (mode === 'version') return printVersion()

  if (rest.length) throw Error(`[faas types] Unknown option: ${rest[0]}`)

  const result = await generateFaasTypes(options)

  console.log(
    `[faas types] ${result.changed ? 'Generated' : 'Up to date'} ${result.output} (${result.routeCount} routes from ${result.fileCount} files)`,
  )

  return 0
}

export const main = createMain(run)
