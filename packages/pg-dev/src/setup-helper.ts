import { resolve } from 'node:path'

import { createClient, getClients, registerDatabaseBootstrap } from '@faasjs/pg'

import type { StartedPGliteServer } from './pglite'
import {
  TYPED_PG_VITEST_DATABASE_URL_ENV_NAME,
  TYPED_PG_VITEST_RESET_EXCLUDE_TABLES,
} from './plugin-context'
import { createTestingPostgres } from './postgres'
import { resetTestingDatabase } from './testing'
import { startTestingServer } from './testing-server'

type Awaitable<T> = T | Promise<T>

export interface TypedPgVitestSetupRuntime {
  afterAll: (callback: () => Awaitable<void>) => void
  beforeEach: (callback: () => Awaitable<void>) => void
  projectRoot?: string
}

async function closeCachedTypedPgClients() {
  await Promise.allSettled(getClients().map((client) => client.quit()))
}

async function resetCurrentTestingDatabase(databaseUrl: string) {
  const sql = createTestingPostgres(databaseUrl)

  try {
    await resetTestingDatabase(sql, TYPED_PG_VITEST_RESET_EXCLUDE_TABLES)
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
 * @param {TypedPgVitestSetupRuntime} runtime - Runtime hooks from the active Vitest project.
 */
export function setupTypedPgVitest(runtime: TypedPgVitestSetupRuntime) {
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

    process.env[TYPED_PG_VITEST_DATABASE_URL_ENV_NAME] = databaseUrl

    return databaseUrl
  }

  registerDatabaseBootstrap(async () => {
    createClient(await ensureTestingDatabaseUrl())
  })

  runtime.beforeEach(async () => {
    if (!testingServerPromise) return

    await closeCachedTypedPgClients()
    await resetCurrentTestingDatabase(await ensureTestingDatabaseUrl())
  })

  runtime.afterAll(async () => {
    await closeCachedTypedPgClients()

    const activeTestingServer = testingServerPromise

    testingServerPromise = undefined

    if (!activeTestingServer) return

    await (await activeTestingServer).stop()
  })
}
