const DATABASE_URL_ENV_NAME = 'DATABASE_URL'

import { createClient } from './client'

/**
 * Async bootstrap used by {@link getClient} when no default client has been cached yet.
 *
 * The bootstrap is responsible for initializing and caching the default client.
 * The built-in bootstrap creates that client from `process.env.DATABASE_URL`, while
 * tools such as `@faasjs/pg-dev` can register a lazy async bootstrap for tests. A
 * custom bootstrap should call {@link createClient} exactly once for the default
 * connection path so `getClient()` can resolve a single cached client afterwards.
 */
export type DatabaseBootstrap = () => void | Promise<void>

function defaultDatabaseBootstrap() {
  const databaseUrl = process.env[DATABASE_URL_ENV_NAME]

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required when no cached client is available')
  }

  createClient(databaseUrl)
}

let databaseBootstrap: DatabaseBootstrap = defaultDatabaseBootstrap
let activeDatabaseBootstrap: Promise<void> | undefined

/**
 * Replaces the async bootstrap used by {@link getClient} for the default client path.
 *
 * The replacement is process-wide for the current module instance. It is primarily
 * intended for test harnesses and local tooling that must lazily start a database
 * before the first default `getClient()` call.
 *
 * @param {DatabaseBootstrap} bootstrap - Function that initializes the default PostgreSQL client
 * cache when `getClient()` is called without an explicit URL and no client is cached yet.
 */
export function registerDatabaseBootstrap(bootstrap: DatabaseBootstrap) {
  databaseBootstrap = bootstrap
}

/**
 * Resolves the registered async database bootstrap.
 *
 * Ensures the bootstrap only runs once concurrently — if it is already running
 * the pending promise is returned instead of starting a second invocation.
 * Failed bootstraps clear the active promise so a later call can retry.
 *
 * @returns A promise that resolves when the bootstrap has completed.
 */
export async function resolveDatabaseBootstrap() {
  if (!activeDatabaseBootstrap) {
    activeDatabaseBootstrap = Promise.resolve()
      .then(() => databaseBootstrap())
      .finally(() => {
        activeDatabaseBootstrap = undefined
      })
  }

  return activeDatabaseBootstrap
}
