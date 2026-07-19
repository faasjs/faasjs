import { mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, it } from 'vitest'

import { withFixturePostgres } from '../shared'

const SERIAL_STATE_DIR_ENV_NAME = 'PG_VITEST_SERIAL_STATE_DIR'

export function defineSerialIsolationCase(caseName: string) {
  it(`isolates ${caseName}`, async () => {
    await withFixturePostgres(async (sql, databaseUrl) => {
      await sql`CREATE TABLE file_scoped_marker (id integer PRIMARY KEY)`
      expect(await sql`SELECT to_regclass('public.file_scoped_marker') AS name`).toEqual([
        { name: 'file_scoped_marker' },
      ])

      const stateDir =
        process.env[SERIAL_STATE_DIR_ENV_NAME] ?? join(tmpdir(), 'faasjs-pg-vitest-plugin-serial')

      mkdirSync(stateDir, { recursive: true })
      writeFileSync(join(stateDir, `${caseName}.json`), JSON.stringify({ caseName, databaseUrl }))
    })
  })
}
