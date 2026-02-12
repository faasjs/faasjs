import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Knex } from 'knex'
import { afterEach, describe, expect, it } from 'vitest'
import {
  createPgliteKnex,
  mountFaasKnex,
  runPgliteSql,
  runPgliteSqlFile,
  unmountFaasKnex,
} from '../pglite'

const globalWithFaasKnex = globalThis as typeof globalThis & {
  FaasJS_Knex?: Record<
    string,
    {
      adapter: Knex
      query: Knex
      config: Record<string, unknown>
    }
  >
}

describe('pglite helpers', () => {
  let db: Knex | undefined

  afterEach(async () => {
    if (db) {
      await db.destroy()
      db = undefined
    }

    unmountFaasKnex()
  })

  it('should run sql with pglite knex', async () => {
    db = createPgliteKnex()

    await runPgliteSql(db, 'CREATE TABLE test_items (id INTEGER)')
    await runPgliteSql(db, 'INSERT INTO test_items (id) VALUES (1)')

    expect(await db('test_items').select('*')).toEqual([{ id: 1 }])
  })

  it('should mount and unmount global FaasJS_Knex', async () => {
    db = createPgliteKnex()

    mountFaasKnex(db)
    expect(globalWithFaasKnex.FaasJS_Knex?.knex?.adapter).toBe(db)

    unmountFaasKnex()
    expect(globalWithFaasKnex.FaasJS_Knex?.knex).toBeUndefined()
  })

  it('should strip uuid extension when running sql file', async () => {
    db = createPgliteKnex()

    const dir = mkdtempSync(join(tmpdir(), 'faasjs-dev-'))
    const filePath = join(dir, 'schema.sql')

    writeFileSync(
      filePath,
      [
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
        'CREATE TABLE todo_items (id INTEGER);',
      ].join('\n')
    )

    try {
      await runPgliteSqlFile(db, filePath)
      expect(await db('todo_items').select('*')).toEqual([])
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
