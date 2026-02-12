import { PGlite, types } from '@electric-sql/pglite'
import type { Knex } from 'knex'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createPgliteKnex, mountFaasKnex, unmountFaasKnex } from '../pglite'

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

  beforeEach(() => {
    db = createPgliteKnex()
  })

  afterEach(async () => {
    if (db) {
      await db.destroy()
      db = undefined
    }

    unmountFaasKnex()
  })

  it('should run sql with pglite knex', async () => {
    await db.raw('CREATE TABLE test_items (id INTEGER)')
    await db.raw('INSERT INTO test_items (id) VALUES (1)')

    expect(await db('test_items').select('*')).toEqual([{ id: 1 }])
  })

  it('should mount and unmount global FaasJS_Knex', async () => {
    mountFaasKnex(db)
    expect(globalWithFaasKnex.FaasJS_Knex?.knex?.adapter).toBe(db)

    unmountFaasKnex()
    expect(globalWithFaasKnex.FaasJS_Knex?.knex).toBeUndefined()
  })

  it('should parse pg number types like @faasjs/knex pg', async () => {
    const row = await db
      .raw(
        'SELECT 1::int2 AS int2, 2::int4 AS int4, 9007199254740993::int8 AS int8, 1.25::float4 AS float4, 2.5::float8 AS float8, 3.75::numeric AS numeric'
      )
      .then((res: any) => res.rows[0])

    expect(row).toEqual({
      int2: 1,
      int4: 2,
      int8: Number.parseInt('9007199254740993', 10),
      float4: 1.25,
      float8: 2.5,
      numeric: 3.75,
    })

    expect(typeof row.int8).toBe('number')
    expect(typeof row.numeric).toBe('number')
  })

  it('should override provided pglite instance parsers', async () => {
    const customPglite = new PGlite({
      parsers: {
        [types.NUMERIC]: () => 'custom-numeric',
      },
    })

    const overriddenDb = createPgliteKnex({}, { pglite: customPglite })

    try {
      const row = await overriddenDb
        .raw('SELECT 3.75::numeric AS numeric')
        .then((res: any) => res.rows[0])

      expect(row.numeric).toBe(3.75)
    } finally {
      await overriddenDb.destroy()
      await customPglite.close()
    }
  })
})
