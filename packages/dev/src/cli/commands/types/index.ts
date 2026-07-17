import { generateFaasTypes } from '../../../typegen/index.ts'
import { createMain, parseCommonCliArgs, printVersion } from '../../utils/index.ts'

const HelpText = `Generate FaasJS API and job type declarations.

Usage:
  faas types [options]

Options:
  --root <path>      Project root path (default: process.cwd())
  -h, --help         Show help
  -v, --version      Show version
`

/**
 * Run the `faas types` command.
 *
 * @param {string[]} args - Arguments after `faas types`.
 * @returns Exit code for the command.
 * @throws {Error} When unexpected positional arguments are provided.
 *
 * @example
 * ```ts
 * const result = await run(['--root', '/path/to/project'])
 * ```
 */
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
    `[faas types] ${result.changed ? 'Generated' : 'Up to date'} ${result.output} (${result.routeCount} routes from ${result.fileCount} API files, ${result.jobCount} jobs)`,
  )

  return 0
}

/**
 * Default Node.js entrypoint for `faas types`.
 *
 * @returns Exit code returned by the wrapped `run` handler.
 *
 * @example
 * ```ts
 * const exitCode = await main(process.argv)
 * ```
 */
export const main = createMain(run)
