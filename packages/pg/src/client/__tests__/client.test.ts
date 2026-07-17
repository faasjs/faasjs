import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import type { Client } from '../../client'
import { createClient } from '../../client'
import { QueryBuilder } from '../../query-builder'
describe('client', () => {
  let client: Client
  beforeAll(async () => {
    client = createClient(process.env.DATABASE_URL!)

    await client.raw`
      CREATE TABLE IF NOT EXISTS client_transaction_test (
        id INTEGER PRIMARY KEY
      )
    `
  })
  afterAll(async () => {
    await client.raw`DROP TABLE client_transaction_test`

    await client.quit()
  })
  describe('raw', () => {
    it('string', async () => {
      expect(await client.raw('SELECT 1+1')).toEqual([{ '?column?': 2 }])
    })
    it('template', async () => {
      expect(await client.raw`SELECT 1+1`).toEqual([{ '?column?': 2 }])
    })
    it('string with params', async () => {
      expect(await client.raw('SELECT 1+?', [1])).toEqual([{ '?column?': 2 }])
    })
    it('template with params', async () => {
      expect(await client.raw`SELECT 1+${1}`).toEqual([{ '?column?': 2 }])
    })
    it('string with type cast', async () => {
      expect(await client.raw('SELECT ?::integer + ?::integer', 1, 1)).toEqual([{ '?column?': 2 }])
    })
    it('template with type cast', async () => {
      expect(await client.raw`SELECT ${1}::integer+${1}::integer`).toEqual([{ '?column?': 2 }])
    })
  })
  it('query', () => {
    expect(client.query('query')).toBeInstanceOf(QueryBuilder)
  })
  it('quit', async () => {
    const localClient = createClient(process.env.DATABASE_URL!)
    await expect(localClient.quit()).resolves.toBeUndefined()
  })
  describe('transaction', () => {
    it('supports the callback-only signature', async () => {
      expect(await client.transaction(async (client) => client.raw`SELECT 1`)).toEqual([
        { '?column?': 1 },
      ])
    })

    it('sets isolation and read-only modes', async () => {
      const [settings] = await client.transaction(
        { isolation: 'repeatable read', readOnly: true },
        async (trx) =>
          trx.raw`
            SELECT
              current_setting('transaction_isolation') AS isolation,
              current_setting('transaction_read_only') AS read_only
          `,
      )

      expect(settings).toEqual({
        isolation: 'repeatable read',
        read_only: 'on',
      })
    })

    it('sets read-write mode explicitly', async () => {
      const [settings] = await client.transaction(
        { readOnly: false },
        async (trx) => trx.raw`SELECT current_setting('transaction_read_only') AS read_only`,
      )

      expect(settings).toEqual({ read_only: 'off' })
    })

    it('rolls back when the callback rejects', async () => {
      await client.raw`TRUNCATE client_transaction_test`

      await expect(
        client.transaction(async (trx) => {
          await trx.raw`INSERT INTO client_transaction_test (id) VALUES (1)`
          throw new Error('transaction failed')
        }),
      ).rejects.toThrow('transaction failed')

      await expect(client.raw`SELECT * FROM client_transaction_test`).resolves.toEqual([])
    })

    it('rejects invalid runtime options', async () => {
      await expect(
        client.transaction({ isolation: 'snapshot' } as any, async (trx) => trx.raw`SELECT 1`),
      ).rejects.toThrow('Invalid transaction isolation level: snapshot')

      await expect(
        client.transaction({ readOnly: 'yes' } as any, async (trx) => trx.raw`SELECT 1`),
      ).rejects.toThrow('Transaction readOnly must be a boolean')
    })
  })
})
