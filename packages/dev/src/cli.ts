import PackageJSON from '../package.json' with { type: 'json' }
import { generateFaasTypes } from './typegen'

type CliOptions = {
  root?: string
  src?: string
  output?: string
  staging?: string
}

const HelpText = `Generate FaasJS API/event type declarations.

Usage:
  faas-types [options]

Options:
  --root <path>      Project root path (default: process.cwd())
  --src <path>       Source directory (default: <root>/src)
  --output <path>    Output file (default: <src>/.faasjs/types.d.ts)
  --staging <name>   Config staging in faas.yaml (default: development)
  -h, --help         Show help
  -v, --version      Show version
`

function parseCliArgs(argv: string[]): {
  showHelp?: boolean
  showVersion?: boolean
  options: CliOptions
} {
  const args = argv.slice(2)
  const options: CliOptions = {}

  const readValue = (index: number, name: string): string => {
    const value = args[index + 1]

    if (!value || value.startsWith('-'))
      throw Error(`[faas-types] Missing value for ${name}`)

    return value
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '-h' || arg === '--help') return { showHelp: true, options }

    if (arg === '-v' || arg === '--version')
      return {
        showVersion: true,
        options,
      }

    if (arg === '--root') {
      options.root = readValue(i, arg)
      i++
      continue
    }

    if (arg === '--src') {
      options.src = readValue(i, arg)
      i++
      continue
    }

    if (arg === '--output') {
      options.output = readValue(i, arg)
      i++
      continue
    }

    if (arg === '--staging') {
      options.staging = readValue(i, arg)
      i++
      continue
    }

    throw Error(`[faas-types] Unknown option: ${arg}`)
  }

  return {
    options,
  }
}

export async function main(argv = process.argv): Promise<number> {
  try {
    const parsed = parseCliArgs(argv)

    if (parsed.showHelp) {
      console.log(HelpText)
      return 0
    }

    if (parsed.showVersion) {
      console.log(PackageJSON.version)
      return 0
    }

    const result = await generateFaasTypes(parsed.options)

    console.log(
      `[faas-types] ${result.changed ? 'Generated' : 'Up to date'} ${result.output} (${result.routeCount} routes from ${result.fileCount} files)`
    )

    return 0
  } catch (error: any) {
    console.error(error?.message || error)
    return 1
  }
}
