import { resolve } from 'node:path'

import { createClient, getClients, registerDatabaseBootstrap } from '@faasjs/pg'

import type { StartedPGliteServer } from '../pglite'
import { PG_VITEST_DATABASE_URL_ENV_NAME, PG_VITEST_RESET_EXCLUDE_TABLES } from '../plugin-context'
import { createTestingPostgres } from '../postgres'
import { resetTestingDatabase } from '../testing'
import { startTestingServer } from '../testing-server'

type Awaitable<T> = T | Promise<T>

export interface PgVitestSetupRuntime {
  afterAll: (callback: () => Awaitable<void>) => void
  beforeEach: (callback: () => Awaitable<void>) => void
  projectRoot?: string
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
 * lookup starts PGlite, runs `./migrations`, and backfills `process.env.DATABASE_URL`. Later tests
 * reuse that database within the current Vitest file while `beforeEach` resets table contents.
 *
 * @param {PgVitestSetupRuntime} runtime - Runtime hooks from the active Vitest project.
 */
export function setupPgVitest(runtime: PgVitestSetupRuntime) {
  const projectRoot = resolve(runtime.projectRoot ?? process.cwd())
  let testingServerPromise: Promise<StartedPGliteServer> | undefined

  const ensureTestingServer = async () => {
    if (!testingServerPromise) {
      testingServerPromise = startTestingServer(projectRoot).catch((error) => {
        testingServerPromise = undefined
        throw error
      })
    }

    return testingServerPromise
  }

  const ensureTestingDatabaseUrl = async () => {
    const { databaseUrl } = await ensureTestingServer()

    process.env[PG_VITEST_DATABASE_URL_ENV_NAME] = databaseUrl

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
