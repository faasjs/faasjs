import PackageJSON from '../../package.json' with { type: 'json' }

export type CliOptions = {
  root?: string
}

type ParsedCommonArgs = {
  mode: 'help' | 'version' | 'run'
  options: CliOptions
  rest: string[]
}

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

export function printVersion(): number {
  console.log(PackageJSON.version)

  return 0
}

export async function runCli(handler: () => Promise<number>): Promise<number> {
  try {
    return await handler()
  } catch (error: any) {
    console.error(error?.message || error)
    return 1
  }
}

export function createMain(run: (args: string[]) => Promise<number>) {
  return async (argv = process.argv): Promise<number> => runCli(() => run(argv.slice(2)))
}
