import { randomUUID } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Func } from '..'
import { afterEach, describe, expect, it } from 'vitest'
import { Knex, KnexSchema } from '../index'

const tempDirs: string[] = []
const clients: Knex[] = []

async function createTempDir(prefix = 'faasjs-knex-schema-'): Promise<string> {
  const path = await mkdtemp(join(tmpdir(), prefix))
  tempDirs.push(path)
  return path
}

async function mountKnex(knex: Knex): Promise<void> {
  const handler = new Func({
    plugins: [knex],
    async handler() {
      return null
    },
  }).export().handler

  await handler({})
}

afterEach(async () => {
  await Promise.all(
    clients.splice(0).map(async (client) => {
      try {
        await client.quit()
      } catch (_) {}
    }),
  )

  await Promise.all(
    tempDirs.splice(0).map((path) =>
      rm(path, {
        recursive: true,
        force: true,
      }),
    ),
  )
})

describe('KnexSchema', () => {
  it('should require migration name when making migration file', async () => {
    const knex = new Knex({
      name: `knex-schema-${randomUUID()}`,
      config: {
        client: 'sqlite3',
        connection: {
          filename: ':memory:',
        },
        useNullAsDefault: true,
      },
    })

    const schema = new KnexSchema(knex)

    await expect(schema.migrateMake('   ')).rejects.toThrow('Missing migration name')
  })

  it('should throw when knex is not initialized', async () => {
    const knex = new Knex({
      name: `knex-schema-${randomUUID()}`,
      config: {
        client: 'sqlite3',
        connection: {
          filename: ':memory:',
        },
        useNullAsDefault: true,
      },
    })

    const schema = new KnexSchema(knex)

    await expect(schema.migrateLatest()).rejects.toThrow('Client not initialized')
  })

  it('should support latest, status, currentVersion and rollback', async () => {
    const root = await createTempDir()
    const migrationsDir = join(root, 'migrations')
    const migrationFile = '20260101000000_create_users.ts'

    await mkdir(migrationsDir, {
      recursive: true,
    })
    await writeFile(
      join(migrationsDir, migrationFile),
      `import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', table => {
    table.increments('id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users')
}
`,
    )

    const knex = new Knex({
      name: `knex-schema-${randomUUID()}`,
      config: {
        client: 'sqlite3',
        connection: {
          filename: ':memory:',
        },
        useNullAsDefault: true,
        migrations: {
          directory: migrationsDir,
          extension: 'ts',
        },
      },
    })

    clients.push(knex)

    await mountKnex(knex)

    const schema = new KnexSchema(knex)

    const [batch, latest] = await schema.migrateLatest()

    expect(batch).toBeGreaterThan(0)
    expect(latest).toEqual([migrationFile])
    expect(await knex.schema().hasTable('users')).toBeTruthy()

    expect(await schema.migrateStatus()).toEqual(0)
    expect(await schema.migrateCurrentVersion()).toEqual('20260101000000')

    const [rollbackBatch, rollbackFiles] = await schema.migrateRollback()

    expect(rollbackBatch).toBeGreaterThan(0)
    expect(rollbackFiles).toEqual([migrationFile])
    expect(await knex.schema().hasTable('users')).toBeFalsy()
  })

  it('should create ts migration file by default', async () => {
    const root = await createTempDir()
    const migrationsDir = join(root, 'migrations')

    const knex = new Knex({
      name: `knex-schema-${randomUUID()}`,
      config: {
        client: 'sqlite3',
        connection: {
          filename: ':memory:',
        },
        useNullAsDefault: true,
        migrations: {
          directory: migrationsDir,
        },
      },
    })

    clients.push(knex)

    await mountKnex(knex)

    const schema = new KnexSchema(knex)
    const filePath = await schema.migrateMake('create_users')

    expect(filePath).toContain(migrationsDir)
    expect(filePath).toMatch(/_create_users\.ts$/)

    const content = await readFile(filePath, 'utf8')
    expect(content).toContain('export async function up')
    expect(content).toContain('export async function down')
  })
})
