import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'

import { Logger } from '@faasjs/node-utils'

import { createClient, type Client } from '../client'
import { Migrator } from '../migrator'

const cliName = 'faasjs-pg'

function printUsage(logger: Logger) {
  logger.error(`Please provide a operation to run: ${cliName} <operation>
- status: Show the status of migrations
- migrate: Run all pending migrations
- up: Run the next migration
- down: Rollback the last migration
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

  const folder = resolve('migrations')
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

export async function main(operation = process.argv[2] as string) {
  const logger = new Logger(cliName)

  if (!operation) {
    printUsage(logger)
    return 1
  }

  if (operation === 'new') return createMigration(logger)

  if (!['status', 'migrate', 'up', 'down'].includes(operation)) {
    logger.error('Unknown operation:', operation)
    return 1
  }

  const connection = process.env.DATABASE_URL as string | undefined

  if (!connection) {
    logger.error(
      `DATABASE_URL not set, please run \`DATABASE_URL=postgres://<your pg url> ${cliName}\``,
    )
    return 1
  }

  let client: Client | undefined

  try {
    client = createClient(connection)
    await client.raw`SELECT 1`
    logger.info('Connected to database successfully')
  } catch (error) {
    logger.error('Error connecting to database, please check your DATABASE_URL\n', error)
    await closeClient(client)
    return 1
  }

  let migrator: Migrator

  try {
    migrator = new Migrator({ client, folder: 'migrations' })
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
