import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import type { Client } from '../../client'
import { createClient } from '../../client'
import { QueryBuilder } from '../../query-builder'
describe('client', () => {
  let client: Client
  beforeAll(() => {
    client = createClient(process.env.DATABASE_URL!)
  })
  afterAll(async () => {
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
  it('transaction', async () => {
    expect(await client.transaction(async (client) => client.raw`SELECT 1`)).toEqual([
      { '?column?': 1 },
    ])
  })
})
