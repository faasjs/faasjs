import { randomUUID } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { Logger } from '@faasjs/node-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createClient, type Client } from '../../client'
import { requireTestingDatabaseUrl } from '../../testing-support/utils'
import { main } from '../main'

const testingDatabaseUrl = requireTestingDatabaseUrl()
const originalArgv = [...process.argv]
const originalCwd = process.cwd()
const originalDatabaseUrl = process.env.DATABASE_URL

function createTempDir() {
  return mkdtempSync(join(tmpdir(), 'faasjs-pg-cli-'))
}

function noopLoggerMethod(this: Logger) {
  return this
}

function captureLogger() {
  return {
    debug: vi.spyOn(Logger.prototype, 'debug').mockImplementation(noopLoggerMethod),
    error: vi.spyOn(Logger.prototype, 'error').mockImplementation(noopLoggerMethod),
    info: vi.spyOn(Logger.prototype, 'info').mockImplementation(noopLoggerMethod),
    time: vi.spyOn(Logger.prototype, 'time').mockImplementation(noopLoggerMethod),
    timeEnd: vi.spyOn(Logger.prototype, 'timeEnd').mockImplementation(noopLoggerMethod),
  }
}

async function withTestingClient<T>(fn: (client: Client) => Promise<T>) {
  const client = createClient(requireTestingDatabaseUrl(testingDatabaseUrl))
  client.logger.level = 'info'

  try {
    return await fn(client)
  } finally {
    await client.quit()
  }
}

async function listMigrationNames() {
  return withTestingClient(async (client) => {
    const [{ regclass }] = await client.raw<{
      regclass: string | null
    }>`SELECT to_regclass('faasjs_pg_migrations') AS regclass`

    if (!regclass) return []

    return (
      await client.raw<{ name: string }>`SELECT name FROM faasjs_pg_migrations ORDER BY name`
    ).map((migration) => migration.name)
  })
}

async function tableExists(tableName: string) {
  const [{ regclass }] = await withTestingClient(
    (client) =>
      client.raw<{ regclass: string | null }>`SELECT to_regclass(${tableName}) AS regclass`,
  )

  return Boolean(regclass)
}

async function dropTableIfExists(client: Client, tableName: string) {
  const [{ regclass }] = await client.raw<{
    regclass: string | null
  }>`SELECT to_regclass(${tableName}) AS regclass`

  if (!regclass) return

  await client.raw(`DROP TABLE "${tableName}"`)
}

describe('cli/main', () => {
  let tempDir: string
  let migrationsDir: string
  let createdTables: string[]

  beforeEach(async () => {
    tempDir = createTempDir()
    migrationsDir = join(tempDir, 'migrations')
    createdTables = []

    process.chdir(tempDir)
    process.argv = ['node', 'faasjs-pg']
    process.env.DATABASE_URL = testingDatabaseUrl

    await withTestingClient(async (client) => {
      await dropTableIfExists(client, 'faasjs_pg_migrations')
    })
  })

  afterEach(async () => {
    await withTestingClient(async (client) => {
      for (const tableName of createdTables) {
        await dropTableIfExists(client, tableName)
      }

      await dropTableIfExists(client, 'faasjs_pg_migrations')
    })

    process.chdir(originalCwd)
    process.argv = [...originalArgv]

    if (typeof originalDatabaseUrl === 'string') process.env.DATABASE_URL = originalDatabaseUrl
    else delete process.env.DATABASE_URL

    vi.restoreAllMocks()
    rmSync(tempDir, { force: true, recursive: true })
  })

  function writeMigration(name: string) {
    mkdirSync(migrationsDir, { recursive: true })

    const normalizedName = name.replace(/[^a-zA-Z0-9_]/g, '_').slice(-20)
    const tableName = `cli_${normalizedName}_${randomUUID().replace(/-/g, '_').slice(0, 12)}`
    const file = join(migrationsDir, `${name}.ts`)

    writeFileSync(
      file,
      `export function up(builder) {
  builder.createTable('${tableName}', table => {
    table.string('id').primary()
  })
}

export function down(builder) {
  builder.dropTable('${tableName}')
}
`,
    )

    createdTables.push(tableName)

    return { file, name, tableName }
  }

  it('logs error when DATABASE_URL is missing', async () => {
    const logger = captureLogger()

    delete process.env.DATABASE_URL

    expect(await main('status')).toBe(1)
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('DATABASE_URL not set'))
  })

  it('logs error on failed database connection', async () => {
    const logger = captureLogger()

    process.env.DATABASE_URL =
      'postgresql://postgres:postgres@127.0.0.1:1/template1?sslmode=disable&connect_timeout=1'

    expect(await main('status')).toBe(1)
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error connecting to database, please check your DATABASE_URL\n'),
      expect.any(Error),
    )
  })

  it('prints operation help when no operation is provided', async () => {
    const logger = captureLogger()

    expect(await main('')).toBe(1)
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Please provide a operation to run'),
    )
  })

  it('runs status operation against the real migrator', async () => {
    const logger = captureLogger()
    const migration = writeMigration('20250101000000_init')

    expect(await main('migrate')).toBe(0)

    logger.info.mockClear()
    logger.error.mockClear()

    expect(await main('status')).toBe(0)
    expect(logger.error).not.toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith('Status:')
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(migration.name))
  })

  it('runs migrate operation against the real database', async () => {
    const logger = captureLogger()
    const migration = writeMigration('20250101000000_create_users')

    expect(await main('migrate')).toBe(0)
    expect(logger.error).not.toHaveBeenCalled()
    expect(await listMigrationNames()).toEqual([migration.name])
    expect(await tableExists(migration.tableName)).toBe(true)
  })

  it('runs up operation against the real database', async () => {
    const logger = captureLogger()
    const firstMigration = writeMigration('20250101000000_first')

    expect(await main('migrate')).toBe(0)

    const secondMigration = writeMigration('20250102000000_second')

    logger.info.mockClear()
    logger.error.mockClear()

    expect(await main('up')).toBe(0)
    expect(logger.error).not.toHaveBeenCalled()
    expect(await listMigrationNames()).toEqual([firstMigration.name, secondMigration.name])
    expect(await tableExists(firstMigration.tableName)).toBe(true)
    expect(await tableExists(secondMigration.tableName)).toBe(true)
  })

  it('runs down operation against the real database', async () => {
    const logger = captureLogger()
    const migration = writeMigration('20250101000000_drop_me')

    expect(await main('migrate')).toBe(0)

    logger.info.mockClear()
    logger.error.mockClear()

    expect(await main('down')).toBe(0)
    expect(logger.error).not.toHaveBeenCalled()
    expect(await listMigrationNames()).toEqual([])
    expect(await tableExists(migration.tableName)).toBe(false)
  })

  it('shows an error when creating a migration without a name without touching the database', async () => {
    const logger = captureLogger()

    process.argv = ['node', 'faasjs-pg', 'new', '']

    expect(await main('new')).toBe(1)
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Please provide a name for the migration'),
    )
    expect(existsSync(migrationsDir)).toBe(false)
  })

  it('creates the migration folder and file with the real filesystem', async () => {
    const logger = captureLogger()

    process.argv = ['node', 'faasjs-pg', 'new', 'create_users']

    expect(await main('new')).toBe(0)
    expect(logger.error).not.toHaveBeenCalled()
    expect(existsSync(migrationsDir)).toBe(true)

    const [filename] = readdirSync(migrationsDir)
    const content = readFileSync(join(migrationsDir, filename), 'utf8')

    expect(filename).toMatch(/^\d{17}-create_users\.ts$/)
    expect(content).toContain('export function up')
    expect(content).toContain('export function down')
  })

  it('creates a migration file without recreating an existing folder', async () => {
    const logger = captureLogger()

    mkdirSync(migrationsDir, { recursive: true })
    process.argv = ['node', 'faasjs-pg', 'new', 'create_posts']

    expect(await main('new')).toBe(0)
    expect(logger.error).not.toHaveBeenCalled()
    expect(readdirSync(migrationsDir)).toHaveLength(1)
  })

  it('logs an error when the migrations folder is missing for database operations', async () => {
    const logger = captureLogger()

    expect(await main('status')).toBe(1)
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Migration folder not found:'),
    )
  })

  it('logs unknown operation', async () => {
    const logger = captureLogger()

    expect(await main('unknown')).toBe(1)
    expect(logger.error).toHaveBeenCalledWith('Unknown operation:', 'unknown')
  })
})
