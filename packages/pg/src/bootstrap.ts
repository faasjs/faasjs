const DATABASE_URL_ENV_NAME = 'DATABASE_URL'

import { createClient } from './client'

/**
 * Async bootstrap used by {@link getClient} when no default client has been cached yet.
 *
 * The bootstrap is responsible for initializing and caching the default client.
 * The built-in bootstrap creates that client from `process.env.DATABASE_URL`, while
 * tools such as `@faasjs/pg-dev` can register a lazy async bootstrap for tests.
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
 * @param {DatabaseBootstrap} bootstrap - Function that initializes the default PostgreSQL client
 * cache when `getClient()` is called without an explicit URL and no client is cached yet.
 */
export function registerDatabaseBootstrap(bootstrap: DatabaseBootstrap) {
  databaseBootstrap = bootstrap
}

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
