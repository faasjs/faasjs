import { resolve } from 'node:path'

import { createClient, getClients, registerDatabaseBootstrap } from '@faasjs/pg'

import type { StartedPGliteServer } from '../pglite'
import { PG_VITEST_RESET_EXCLUDE_TABLES } from '../plugin-context'
import { createTestingPostgres } from '../postgres'
import { resetTestingDatabase } from '../testing'
import { startTestingServer } from '../testing-server'

/**
 * Runtime hooks provided by the Vitest project that `setupPgVitest` wires into.
 *
 * Pass Vitest's `afterAll` and `beforeEach` functions from the active setup module.
 * `projectRoot` should point at the project whose `src/db/migrations` directory should
 * be applied to the temporary database.
 */
export interface PgVitestSetupRuntime {
  /** Lifecycle hook called once after all tests in the file finish. */
  afterAll: (callback: () => void | Promise<void>) => void
  /** Lifecycle hook called before each test in the file. */
  beforeEach: (callback: () => void | Promise<void>) => void
  /** Optional project root directory. Defaults to `process.cwd()`. */
  projectRoot?: string
  /** Internal run-scoped migration snapshot directory supplied by `PgVitestPlugin`. */
  snapshotDir?: string
}

async function closeCachedPgClients() {
  await Promise.allSettled(getClients().map((client) => client.quit()))
}

async function resetCurrentTestingDatabase(databaseUrl: string) {
  const sql = createTestingPostgres(databaseUrl)

  try {
    await resetTestingDatabase(sql, PG_VITEST_RESET_EXCLUDE_TABLES)
  } finally {
    await sql.end()
  }
}

/**
 * Wires `@faasjs/pg-dev` into a Vitest setup module without forcing consumers to import package
 * setup files directly from `node_modules`.
 *
 * The helper registers a lazy async bootstrap for `await getClient()`. The first default-client
 * lookup starts an isolated PGlite database, backfills `process.env.DATABASE_URL`, and creates
 * the cached `@faasjs/pg` client. When called by `PgVitestPlugin`, the first database-using file
 * in the run creates one migrated snapshot and later files clone it. Manual calls without a
 * snapshot directory retain the direct migrate-on-start behavior. If startup or migrations fail,
 * the lazy promise is cleared so the next lookup can retry.
 *
 * The registered `beforeEach` hook is intentionally cheap before the database is booted. After
 * boot, it closes cached `@faasjs/pg` clients, truncates public tables with identity restart and
 * cascade semantics, and preserves `faasjs_pg_migrations`. The `afterAll` hook closes cached
 * clients and stops the active PGlite server.
 *
 * @param {PgVitestSetupRuntime} runtime - Runtime hooks from the active Vitest project.
 */
export function setupPgVitest(runtime: PgVitestSetupRuntime) {
  const projectRoot = resolve(runtime.projectRoot ?? process.cwd())
  let testingServerPromise: Promise<StartedPGliteServer> | undefined

  const ensureTestingServer = async () => {
    if (!testingServerPromise) {
      testingServerPromise = startTestingServer(projectRoot, runtime.snapshotDir).catch((error) => {
        testingServerPromise = undefined
        throw error
      })
    }

    return testingServerPromise
  }

  const ensureTestingDatabaseUrl = async () => {
    const { databaseUrl } = await ensureTestingServer()

    process.env.DATABASE_URL = databaseUrl

    return databaseUrl
  }

  registerDatabaseBootstrap(async () => {
    createClient(await ensureTestingDatabaseUrl())
  })

  runtime.beforeEach(async () => {
    if (!testingServerPromise) return

    await closeCachedPgClients()
    await resetCurrentTestingDatabase(await ensureTestingDatabaseUrl())
  })

  runtime.afterAll(async () => {
    await closeCachedPgClients()

    const activeTestingServer = testingServerPromise

    testingServerPromise = undefined

    if (!activeTestingServer) return

    await (await activeTestingServer).stop()
  })
}
