import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { Migrator } from '..'
import { requireTestingDatabaseUrl } from '../../__tests__/utils'
import type { Client } from '../../client'
import { createClient } from '../../client'

function createTempFolder(tempFolders: string[]) {
  const folder = mkdtempSync(join(tmpdir(), 'typed-pg-migrator-'))
  tempFolders.push(folder)
  return folder
}

function writeMigration(folder: string, filename: string, content: string) {
  writeFileSync(join(folder, filename), content)
}

function createSimpleMigrationContent(label: string) {
  const tableName = `migration_${label}_${Math.random().toString(16).slice(2)}`

  return `export function up(builder) {
  builder.createTable('${tableName}', table => {
    table.string('id').primary()
  })
}

export function down(builder) {
  builder.dropTable('${tableName}')
}
`
}

function createRawSqlMigrationContent(label: string) {
  const parentTable = `migration_${label}_parent_${Math.random().toString(16).slice(2)}`
  const childTable = `migration_${label}_child_${Math.random().toString(16).slice(2)}`

  return {
    childTable,
    content: `export function up(builder) {
  builder.raw(\`
    CREATE TABLE IF NOT EXISTS ${parentTable} (
      id VARCHAR PRIMARY KEY
    )
  \`)
  builder.raw(\`
    CREATE TABLE IF NOT EXISTS ${childTable} (
      id VARCHAR PRIMARY KEY,
      parent_id VARCHAR NOT NULL REFERENCES ${parentTable}(id)
    )
  \`)
}

export function down(builder) {
  builder.raw('DROP TABLE IF EXISTS ${childTable}')
  builder.raw('DROP TABLE IF EXISTS ${parentTable}')
}
`,
    parentTable,
  }
}

async function getMigrationNames(migrator: Migrator) {
  return (await migrator.status()).map((migration: { name: string }) => migration.name).sort()
}

describe('Migrator', () => {
  let client: Client
  let tempFolders: string[]

  beforeEach(async () => {
    client = createClient(requireTestingDatabaseUrl())
    tempFolders = []

    await client.raw`DROP TABLE IF EXISTS typed_pg_migrations`
    await client.raw`DROP TABLE IF EXISTS migrations`
  })

  afterEach(async () => {
    await client.quit()

    for (const folder of tempFolders) rmSync(folder, { recursive: true, force: true })
  })

  it('should create migration table', async () => {
    const migrator = new Migrator({ client, folder: __dirname + '/migrations' })

    expect(await migrator.status()).toEqual([])
  })

  it('should run migration', async () => {
    const migrator = new Migrator({ client, folder: __dirname + '/migrations' })

    await migrator.migrate()

    expect(await migrator.status()).toEqual([
      {
        name: '20250101000000_create_migrations',
        migration_time: expect.any(Date),
      },
    ])

    expect(await client.raw`SELECT * FROM migrations`).toEqual([])

    await migrator.down()

    expect(await migrator.status()).toEqual([])
  })

  it('should throw when migration folder does not exist', () => {
    const folder = join(tmpdir(), `typed-pg-missing-${Date.now()}-${Math.random()}`)

    expect(() => new Migrator({ client, folder })).toThrowError('Migration folder not found')
  })

  it('should do nothing when migrate has no files', async () => {
    const folder = createTempFolder(tempFolders)
    const migrator = new Migrator({ client, folder })

    await migrator.migrate()

    expect(await migrator.status()).toEqual([])
  })

  it('should skip migration that already ran', async () => {
    const folder = createTempFolder(tempFolders)
    writeMigration(folder, '20250101000000_once.ts', createSimpleMigrationContent('once'))

    const migrator = new Migrator({ client, folder })

    await migrator.migrate()
    await migrator.migrate()

    expect(await getMigrationNames(migrator)).toEqual(['20250101000000_once'])
  })

  it('should run raw sql migrations through SchemaBuilder.run', async () => {
    const folder = createTempFolder(tempFolders)
    const migration = createRawSqlMigrationContent('raw_sql')

    writeMigration(folder, '20250101000000_raw_sql.ts', migration.content)

    const migrator = new Migrator({ client, folder })

    await migrator.migrate()

    expect(await getMigrationNames(migrator)).toEqual(['20250101000000_raw_sql'])
    expect(
      await client.raw<{ regclass: string | null }>(
        `SELECT to_regclass('${migration.parentTable}') AS regclass`,
      ),
    ).toEqual([{ regclass: migration.parentTable }])
    expect(
      await client.raw<{ regclass: string | null }>(
        `SELECT to_regclass('${migration.childTable}') AS regclass`,
      ),
    ).toEqual([{ regclass: migration.childTable }])
  })

  it('should reject when migrate migration throws', async () => {
    const folder = createTempFolder(tempFolders)
    writeMigration(
      folder,
      '20250101000000_fail.ts',
      `export function up() {
  throw new Error('migrate failed')
}

export function down() {}
`,
    )

    const migrator = new Migrator({ client, folder })

    await expect(migrator.migrate()).rejects.toThrowError('migrate failed')
    expect(await migrator.status()).toEqual([])
  })

  it('should do nothing when up has no files', async () => {
    const folder = createTempFolder(tempFolders)
    const migrator = new Migrator({ client, folder })

    await migrator.up()

    expect(await migrator.status()).toEqual([])
  })

  it('should run the next pending migration in up', async () => {
    const folder = createTempFolder(tempFolders)
    writeMigration(folder, '20250101000000_first.ts', createSimpleMigrationContent('first'))
    writeMigration(folder, '20250102000000_second.ts', createSimpleMigrationContent('second'))

    const migrator = new Migrator({ client, folder })

    await migrator.createMigrationTable()
    await client.raw`INSERT INTO typed_pg_migrations (name, migration_time) VALUES (${'20250101000000_first'}, NOW())`

    await migrator.up()

    expect(await getMigrationNames(migrator)).toEqual([
      '20250101000000_first',
      '20250102000000_second',
    ])
  })

  it('should do nothing when up has no pending migration', async () => {
    const folder = createTempFolder(tempFolders)
    writeMigration(folder, '20250101000000_first.ts', createSimpleMigrationContent('first'))

    const migrator = new Migrator({ client, folder })

    await migrator.createMigrationTable()
    await client.raw`INSERT INTO typed_pg_migrations (name, migration_time) VALUES (${'20250101000000_first'}, NOW())`

    await migrator.up()

    expect(await getMigrationNames(migrator)).toEqual(['20250101000000_first'])
  })

  it('should reject when up migration throws', async () => {
    const folder = createTempFolder(tempFolders)
    writeMigration(folder, '20250101000000_first.ts', createSimpleMigrationContent('first'))
    writeMigration(
      folder,
      '20250102000000_second.ts',
      `export function up() {
  throw new Error('up failed')
}

export function down() {}
`,
    )

    const migrator = new Migrator({ client, folder })

    await migrator.createMigrationTable()
    await client.raw`INSERT INTO typed_pg_migrations (name, migration_time) VALUES (${'20250101000000_first'}, NOW())`

    await expect(migrator.up()).rejects.toThrowError('up failed')
    expect(await getMigrationNames(migrator)).toEqual(['20250101000000_first'])
  })

  it('should do nothing when down has no files', async () => {
    const folder = createTempFolder(tempFolders)
    const migrator = new Migrator({ client, folder })

    await migrator.down()

    expect(await migrator.status()).toEqual([])
  })

  it('should do nothing when down has no migration history', async () => {
    const folder = createTempFolder(tempFolders)
    writeMigration(folder, '20250101000000_first.ts', createSimpleMigrationContent('first'))

    const migrator = new Migrator({ client, folder })

    await migrator.down()

    expect(await migrator.status()).toEqual([])
  })

  it('should do nothing when down migration file is missing', async () => {
    const folder = createTempFolder(tempFolders)
    writeMigration(folder, '20250101000000_first.ts', createSimpleMigrationContent('first'))

    const migrator = new Migrator({ client, folder })

    await migrator.createMigrationTable()
    await client.raw`INSERT INTO typed_pg_migrations (name, migration_time) VALUES (${'20250109000000_missing'}, NOW())`

    await migrator.down()

    expect(await getMigrationNames(migrator)).toEqual(['20250109000000_missing'])
  })

  it('should reject when down migration throws', async () => {
    const folder = createTempFolder(tempFolders)
    writeMigration(
      folder,
      '20250101000000_fail_down.ts',
      `export function up(builder) {
  builder.createTable('migration_fail_down', table => {
    table.string('id').primary()
  })
}

export function down() {
  throw new Error('down failed')
}
`,
    )

    const migrator = new Migrator({ client, folder })

    await migrator.createMigrationTable()
    await client.raw`INSERT INTO typed_pg_migrations (name, migration_time) VALUES (${'20250101000000_fail_down'}, NOW())`

    await expect(migrator.down()).rejects.toThrowError('down failed')
    expect(await getMigrationNames(migrator)).toEqual(['20250101000000_fail_down'])
  })
})
