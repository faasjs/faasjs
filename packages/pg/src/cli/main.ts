import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'

import { Logger } from '@faasjs/node-utils'

import { createClient, type Client } from '../client'
import { Migrator } from '../migrator'

const cliName = 'faasjs-pg'
const databaseOperations = ['status', 'migrate', 'up', 'down', 'sql']

export type MainOptions = {
  stdin?: AsyncIterable<string | Buffer> & {
    setEncoding?: (encoding: BufferEncoding) => unknown
  }
}

function printUsage(logger: Logger) {
  logger.error(`Please provide a operation to run: ${cliName} <operation>
- status: Show the status of migrations
- migrate: Run all pending migrations
- up: Run the next migration
- down: Rollback the last migration
- sql <sql>: Execute SQL and print the result as JSON
- new <name>: Create a new migration file with the given name
`)
}

async function closeClient(client?: Client) {
  if (!client) return

  try {
    await client.quit()
  } catch {
    // Ignore connection shutdown failures so the original CLI result wins.
  }
}

function createMigration(logger: Logger, name = process.argv[3] as string) {
  if (!name) {
    logger.error(`Please provide a name for the migration: \`${cliName} new <name>\``)
    return 1
  }

  const folder = resolve('src/db/migrations')
  const filename = `${new Date().toISOString().replace(/[^0-9]/g, '')}-${name}.ts`
  const file = join(folder, filename)

  if (!existsSync(folder)) mkdirSync(folder, { recursive: true })
  writeFileSync(
    file,
    `// ${filename}.ts
import type { SchemaBuilder } from '@faasjs/pg'

export function up(builder: SchemaBuilder) {
  // Write your migration here
}

export function down(builder: SchemaBuilder) {
  // Write your rollback here
}
`,
  )

  logger.info('Created migration:', file)
  return 0
}

async function readStdin(options: MainOptions) {
  const stdin = options.stdin || process.stdin

  stdin.setEncoding?.('utf8')

  let sql = ''

  for await (const chunk of stdin) {
    sql += chunk
  }

  return sql
}

async function readSqlInput(options: MainOptions) {
  const args = process.argv.slice(3)

  if (!args.length || (args.length === 1 && args[0] === '-')) return readStdin(options)

  return args.join(' ')
}

async function createConnectedClient(
  logger: Logger,
  options?: { logSuccess?: boolean; silenceNotices?: boolean },
) {
  const connection = process.env.DATABASE_URL as string | undefined

  if (!connection) {
    logger.error(
      `DATABASE_URL not set, please run \`DATABASE_URL=postgres://<your pg url> ${cliName}\``,
    )
    return
  }

  let client: Client | undefined

  try {
    client = createClient(
      connection,
      options?.silenceNotices ? { onnotice: () => undefined } : undefined,
    )
    await client.raw`SELECT 1`
    if (options?.logSuccess !== false) logger.info('Connected to database successfully')
    return client
  } catch (error) {
    logger.error('Error connecting to database, please check your DATABASE_URL\n', error)
    await closeClient(client)
  }
}

async function executeSql(logger: Logger, options: MainOptions) {
  const sql = await readSqlInput(options)

  if (!sql.trim()) {
    logger.error(`Please provide SQL to execute: \`${cliName} sql "SELECT 1"\``)
    return 1
  }

  const client = await createConnectedClient(logger, { logSuccess: false, silenceNotices: true })

  if (!client) return 1

  try {
    const result = await client.postgres.unsafe(sql)

    logger.raw(
      JSON.stringify(
        {
          command: result.command,
          count: result.count,
          rows: [...result],
        },
        null,
        2,
      ),
    )

    return 0
  } catch (error) {
    logger.error('Error executing SQL\n', error)
    return 1
  } finally {
    await closeClient(client)
  }
}

/**
 * CLI entry point for migration operations.
 *
 * Supported operations: `status`, `migrate`, `up`, `down`, `sql <sql>`, `new <name>`.
 *
 * Requires `DATABASE_URL` environment variable for database operations.
 *
 * @param operation - The CLI operation to perform (defaults to `process.argv[2]`).
 * @param options - Optional test hooks for CLI input streams.
 * @returns Exit code (0 on success, 1 on failure).
 */
export async function main(operation = process.argv[2] as string, options: MainOptions = {}) {
  const logger = new Logger(cliName)

  if (!operation) {
    printUsage(logger)
    return 1
  }

  if (operation === 'new') return createMigration(logger)

  if (!databaseOperations.includes(operation)) {
    logger.error('Unknown operation:', operation)
    return 1
  }

  if (operation === 'sql') return executeSql(logger, options)

  const client = await createConnectedClient(logger)

  if (!client) return 1

  let migrator: Migrator

  try {
    migrator = new Migrator({ client, folder: 'src/db/migrations' })
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error))
    await closeClient(client)
    return 1
  }

  try {
    switch (operation) {
      case 'status': {
        const migrations = await migrator.status()

        logger.info('Status:')
        migrations.forEach((migration) => {
          logger.info(`- ${migration.name} (${migration.migration_time})`)
        })
        return 0
      }
      case 'migrate': {
        await migrator.migrate()
        return 0
      }
      case 'up': {
        await migrator.up()
        return 0
      }
      case 'down': {
        await migrator.down()
        return 0
      }
      default:
        return 1
    }
  } catch (error) {
    if (operation === 'status') logger.error(error)
    return 1
  } finally {
    await closeClient(client)
  }
}
