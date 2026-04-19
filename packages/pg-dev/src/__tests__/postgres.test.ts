import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { startPGliteServer, type StartedPGliteServer } from '../pglite'
import { createTestingPostgres } from '../postgres'

describe('postgres helpers', () => {
  let testingServer: StartedPGliteServer
  const previousDatabaseUrl = process.env.DATABASE_URL

  beforeAll(async () => {
    testingServer = await startPGliteServer()
  })

  afterAll(async () => {
    await testingServer.stop()
  })

  afterEach(() => {
    if (typeof previousDatabaseUrl === 'string') process.env.DATABASE_URL = previousDatabaseUrl
    else delete process.env.DATABASE_URL
  })

  it('prefers DATABASE_URL from the environment', async () => {
    process.env.DATABASE_URL = testingServer.databaseUrl

    const sql = createTestingPostgres()

    try {
      const [row] = await sql<{ value: number }[]>`select 1 as value`

      expect(row?.value).toBe(1)
    } finally {
      await sql.end()
    }
  })

  it('supports an explicit database url override', async () => {
    const sql = createTestingPostgres(testingServer.databaseUrl)

    try {
      const [row] = await sql<{ value: number }[]>`select 1 as value`

      expect(row?.value).toBe(1)
    } finally {
      await sql.end()
    }
  })

  it('requires DATABASE_URL when no explicit url is given', () => {
    delete process.env.DATABASE_URL

    expect(() => createTestingPostgres()).toThrow(/DATABASE_URL/)
  })
})
