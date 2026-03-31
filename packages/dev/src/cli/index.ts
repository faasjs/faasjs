import { run as runFileCli } from './run'
import { createMain, printVersion } from './shared'
import { run as runTypesCli } from './types'

const HelpText = `FaasJS CLI.

Usage:
  faas <command> [...args]

Commands:
  run [options] <file>            Run a TypeScript file with FaasJS loader hooks
  types [options]                 Generate FaasJS API type declarations

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
 */
export async function run(args: string[]): Promise<number> {
  const command = args[0]

  if (!command || command === '-h' || command === '--help') {
    console.log(HelpText)
    return 0
  }

  if (command === '-v' || command === '--version') return printVersion()

  const handler = Commands[command as keyof typeof Commands]

  if (!handler) throw Error(`[faas] Unknown command: ${command}`)

  return await handler(args.slice(1))
}

/**
 * Default Node.js entrypoint for the `faas` binary.
 */
export const main = createMain(run)
