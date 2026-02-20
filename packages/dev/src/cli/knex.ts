import { join } from 'node:path'
import { useKnex as createKnex, KnexSchema } from '@faasjs/core'
import { loadConfig } from '@faasjs/node-utils'
import { resolveServerConfig } from '../server_config'
import { type CliOptions, createMain, parseCommonCliArgs, printVersion } from './shared'

const MigrateActions = ['latest', 'rollback', 'status', 'current', 'make'] as const

type MigrateAction = (typeof MigrateActions)[number]

type ParsedKnexArgs =
  | {
      mode: 'help'
      options: CliOptions
    }
  | {
      mode: 'version'
      options: CliOptions
    }
  | {
      mode: 'run'
      options: CliOptions
      action: Exclude<MigrateAction, 'make'>
    }
  | {
      mode: 'run'
      options: CliOptions
      action: 'make'
      name: string
    }

function isMigrateAction(value: string): value is MigrateAction {
  return MigrateActions.includes(value as MigrateAction)
}

const ActionHandlers: Record<
  Exclude<MigrateAction, 'make'>,
  (schema: KnexSchema) => Promise<void>
> = {
  latest: (schema) => schema.migrateLatest(),
  rollback: (schema) => schema.migrateRollback(),
  status: async (schema) => {
    console.log(await schema.migrateStatus())
  },
  current: async (schema) => {
    console.log(await schema.migrateCurrentVersion())
  },
}

const HelpText = `Run FaasJS knex migrations.

Usage:
  faas knex <action> [name] [options]

Actions:
  latest             Run all pending migrations
  rollback           Roll back the last migration batch
  status             Print pending migration count
  current            Print current migration version
  make <name>        Create a new migration file

Options:
  --root <path>      Project root path (default: process.cwd())
  -h, --help         Show help
  -v, --version      Show version
`

function parseCliArgs(args: string[]): ParsedKnexArgs {
  const { mode, options, rest } = parseCommonCliArgs(args, 'faas knex')

  if (mode !== 'run') return { mode, options }

  const [action, name, extra] = rest

  if (!action)
    throw Error(
      '[faas knex] Missing action. Usage: faas knex <latest|rollback|status|current|make>',
    )

  if (!isMigrateAction(action)) throw Error(`[faas knex] Unknown action: ${action}`)

  if (action !== 'make') {
    if (name) throw Error(`[faas knex] Unexpected argument: ${name}`)

    return {
      mode: 'run',
      action,
      options,
    }
  }

  if (!name) throw Error('[faas knex] Missing migration name. Usage: faas knex make create_users')

  if (extra) throw Error(`[faas knex] Unexpected argument: ${extra}`)

  return {
    mode: 'run',
    action: 'make',
    name,
    options,
  }
}

export async function run(args: string[]): Promise<number> {
  const parsed = parseCliArgs(args)

  if (parsed.mode === 'help') {
    console.log(HelpText)
    return 0
  }

  if (parsed.mode === 'version') return printVersion()

  const { root: projectRoot, staging } = resolveServerConfig(parsed.options.root ?? process.cwd())
  const srcRoot = join(projectRoot, 'src')
  const config = loadConfig(srcRoot, join(srcRoot, 'index.func.ts'), staging) as {
    plugins?: {
      knex?: {
        config?: any
      }
    }
  }
  const knex = createKnex({
    config: config.plugins?.knex?.config,
  })

  await knex.mount()

  const schema = new KnexSchema(knex)

  try {
    if (parsed.action === 'make') console.log(await schema.migrateMake(parsed.name))
    else await ActionHandlers[parsed.action](schema)
  } finally {
    await knex.quit()
  }

  return 0
}

export const main = createMain(run)
