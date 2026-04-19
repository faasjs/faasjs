import postgres from 'postgres'
import { describe, expect, it } from 'vitest'

import { startPGliteServer } from '../pglite'

describe('pglite helpers', () => {
  it('starts a pglite socket server with a working postgres url for default postgres.js clients', async () => {
    const testingServer = await startPGliteServer()
    const firstSql = postgres(testingServer.databaseUrl)
    const secondSql = postgres(testingServer.databaseUrl)

    try {
      const [[firstRow], [secondRow]] = await Promise.all([
        firstSql<{ value: number }[]>`select 1 as value`,
        secondSql<{ value: number }[]>`select 2 as value`,
      ])

      expect(firstRow?.value).toBe(1)
      expect(secondRow?.value).toBe(2)
    } finally {
      await Promise.allSettled([firstSql.end(), secondSql.end()])
      await testingServer.stop()
    }
  })
})
