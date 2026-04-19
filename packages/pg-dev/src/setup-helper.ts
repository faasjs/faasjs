import { getClients } from '@faasjs/pg'

import {
  TYPED_PG_VITEST_DATABASE_URL_ENV_NAME,
  TYPED_PG_VITEST_DATABASE_URLS_KEY,
  TYPED_PG_VITEST_RESET_EXCLUDE_TABLES,
  requireTypedPgVitestDatabaseUrl,
} from './plugin-context'
import { createTestingPostgres } from './postgres'
import { resetTestingDatabase } from './testing'

type Awaitable<T> = T | Promise<T>

export interface TypedPgVitestSetupRuntime {
  beforeEach: (callback: () => Awaitable<void>) => void
  inject: (key: typeof TYPED_PG_VITEST_DATABASE_URLS_KEY) => Record<string, string> | undefined
}

async function closeCachedTypedPgClients() {
  await Promise.allSettled(getClients().map((client) => client.quit()))
}

/**
 * Wires `@faasjs/pg-dev` into a Vitest setup module without forcing consumers to import package
 * setup files directly from `node_modules`.
 *
 * This is primarily used by the plugin's generated setup module so the active project imports
 * `vitest` locally while reusing the shared database reset logic from `@faasjs/pg-dev`.
 *
 * @param {TypedPgVitestSetupRuntime} runtime - Runtime hooks from the active Vitest project.
 * @returns Temporary database URL for the current worker.
 */
export function setupTypedPgVitest(runtime: TypedPgVitestSetupRuntime) {
  const databaseUrls = runtime.inject(TYPED_PG_VITEST_DATABASE_URLS_KEY)
  const databaseUrl = requireTypedPgVitestDatabaseUrl(databaseUrls)

  process.env[TYPED_PG_VITEST_DATABASE_URL_ENV_NAME] = databaseUrl

  runtime.beforeEach(async () => {
    await closeCachedTypedPgClients()

    const sql = createTestingPostgres(databaseUrl)

    try {
      await resetTestingDatabase(sql, TYPED_PG_VITEST_RESET_EXCLUDE_TABLES)
    } finally {
      await sql.end()
    }
  })

  return databaseUrl
}
