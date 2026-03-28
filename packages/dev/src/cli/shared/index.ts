import PackageJSON from '../../../package.json' with { type: 'json' }

/**
 * Common CLI options shared by FaasJS subcommands.
 */
export type CliOptions = {
  /**
   * Project root used by commands that resolve files from disk.
   */
  root?: string
}

type ParsedCommonArgs = {
  mode: 'help' | 'version' | 'run'
  options: CliOptions
  rest: string[]
}

/**
 * Parse flags shared by FaasJS CLI subcommands.
 *
 * @param {string[]} args - Raw arguments after the subcommand name.
 * @param {string} scope - Error prefix used in thrown messages.
 * @returns Parsed execution mode, normalized options, and remaining positional arguments.
 * @throws {Error} When an option is unknown or `--root` is missing a value.
 */
export function parseCommonCliArgs(args: string[], scope: string): ParsedCommonArgs {
  const options: CliOptions = {}
  const rest: string[] = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '-h' || arg === '--help') return { mode: 'help', options, rest }

    if (arg === '-v' || arg === '--version')
      return {
        mode: 'version',
        options,
        rest,
      }

    if (arg === '--root') {
      const value = args[i + 1]

      if (!value || value.startsWith('-')) throw Error(`[${scope}] Missing value for ${arg}`)

      options.root = value
      i += 1
      continue
    }

    if (arg.startsWith('-')) throw Error(`[${scope}] Unknown option: ${arg}`)

    rest.push(arg)
  }

  return {
    mode: 'run',
    options,
    rest,
  }
}

/**
 * Print the current `@faasjs/dev` package version.
 *
 * @returns Zero exit code after printing the version.
 */
export function printVersion(): number {
  console.log(PackageJSON.version)

  return 0
}

/**
 * Run a CLI handler and convert thrown errors into a process-style exit code.
 *
 * @param {() => Promise<number>} handler - Async command handler that returns an exit code.
 * @returns Exit code from the handler, or `1` after printing an error message.
 */
export async function runCli(handler: () => Promise<number>): Promise<number> {
  try {
    return await handler()
  } catch (error: any) {
    console.error(error?.message || error)
    return 1
  }
}

/**
 * Create a Node.js CLI entrypoint that reads arguments from `process.argv`.
 *
 * @param {(args: string[]) => Promise<number>} run - Command runner that expects arguments after the executable name.
 * @returns Async entrypoint suitable for CLI binaries.
 */
export function createMain(run: (args: string[]) => Promise<number>) {
  return async (argv = process.argv): Promise<number> => runCli(() => run(argv.slice(2)))
}
