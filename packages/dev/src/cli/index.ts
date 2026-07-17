import { run as runFileCli } from './commands/run'
import { run as runTypesCli } from './commands/types'
import { createMain, type CliRunOptions, printVersion } from './utils'

const HelpText = `FaasJS CLI.

Usage:
  faas <command> [...args]

Commands:
  run [options] <file>            Run a TypeScript file with FaasJS loader hooks
  types [options]                 Generate FaasJS API and job type declarations

Options:
  -h, --help                      Show help
  -v, --version                   Show version
`

const Commands = {
  run: runFileCli,
  types: runTypesCli,
} as const

/**
 * Run the top-level `faas` CLI.
 *
 * @param {string[]} args - Arguments after the `faas` executable name.
 * @returns Exit code for the selected subcommand.
 * @throws {Error} When the subcommand name is unknown.
 *
 * @example
 * ```ts
 * const result = await run(['types', '--root', '/path/to/project'])
 * ```
 */
export async function run(args: string[], options: CliRunOptions = {}): Promise<number> {
  const command = args[0]

  if (!command || command === '-h' || command === '--help') {
    console.log(HelpText)
    return 0
  }

  if (command === '-v' || command === '--version') return printVersion()

  const handler = Commands[command as keyof typeof Commands]

  if (!handler) throw Error(`[faas] Unknown command: ${command}`)

  if (handler === runFileCli) return await handler(args.slice(1), options)

  return await handler(args.slice(1))
}

/**
 * Default Node.js entrypoint for the `faas` binary.
 *
 * @returns Exit code returned by the wrapped `run` handler.
 *
 * @example
 * ```ts
 * const exitCode = await main(process.argv)
 * ```
 */
export const main = createMain(run)
