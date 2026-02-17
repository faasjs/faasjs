import { run as runKnexCli } from './knex'
import { createMain, printVersion } from './shared'
import { run as runTypesCli } from './types'

const HelpText = `FaasJS CLI.

Usage:
  faas <command> [...args]

Commands:
  types [options]                 Generate FaasJS API/event type declarations
  knex <action> [name] [options]  Run FaasJS knex migrations

Options:
  -h, --help                      Show help
  -v, --version                   Show version
`

const Commands = {
  types: runTypesCli,
  knex: runKnexCli,
} as const

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

export const main = createMain(run)
