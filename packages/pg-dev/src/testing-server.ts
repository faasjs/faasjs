import { existsSync, globSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { Migrator, createClient } from '@faasjs/pg'

import { getOrCreateMigrationSnapshot } from './migration-snapshot'
import { startPGliteServer, type StartedPGliteServer } from './pglite'

function resolveMigrationsFolder(projectRoot: string) {
  return resolve(projectRoot, 'src/db/migrations')
}

/**
 * Runs database migrations from the `src/db/migrations/` directory using `@faasjs/pg` Migrator.
 *
 * Skips silently when the folder does not exist or contains no `.ts` files.
 *
 * @param {string} projectRoot - Absolute path to the project root containing the `src/db/migrations/` directory.
 * @param {string} databaseUrl - PostgreSQL connection URL for the migration client.
 */
export async function runTestingMigrations(projectRoot: string, databaseUrl: string) {
  const migrationsFolder = resolveMigrationsFolder(projectRoot)

  if (!existsSync(migrationsFolder) || !globSync(join(migrationsFolder, '*.ts')).length) {
    return
  }

  const client = createClient(databaseUrl, {
    max: 1,
    ssl: false,
  })

  try {
    await new Migrator({ client, folder: migrationsFolder }).migrate()
  } finally {
    await client.quit()
  }
}

/**
 * Starts an isolated PGlite socket server for the project.
 *
 * With a snapshot directory, migrations are run once per Vitest project and each test file gets
 * a clone of the published snapshot. Without one, the server runs migrations directly for
 * backwards-compatible manual setup. `process.env.DATABASE_URL` is backfilled by the setup
 * helper after startup.
 *
 * @param {string} projectRoot - Absolute path to the project root containing the `migrations/` directory.
 * @param {string} [snapshotDir] - Shared run-scoped snapshot directory supplied by global setup.
 * @returns {Promise<StartedPGliteServer>} A running PGlite server handle.
 * @throws When migration execution fails (the server is stopped before re-throwing).
 */
export async function startTestingServer(projectRoot: string, snapshotDir?: string) {
  if (snapshotDir) {
    const snapshot = await getOrCreateMigrationSnapshot(snapshotDir, async () => {
      const snapshotServer = await startPGliteServer()

      try {
        await runTestingMigrations(projectRoot, snapshotServer.databaseUrl)
        return snapshotServer.dumpDataDir('none')
      } finally {
        await snapshotServer.stop()
      }
    })

    return startPGliteServer({ loadDataDir: snapshot })
  }

  const testingServer = await startPGliteServer()

  try {
    await runTestingMigrations(projectRoot, testingServer.databaseUrl)
    return testingServer
  } catch (error) {
    await testingServer.stop()
    throw error
  }
}

/**
 * Stops a batch of PGlite servers, tolerating individual failure.
 *
 * Useful in global teardown where every server must be released regardless of
 * any single stop error.
 *
 * @param {StartedPGliteServer[]} testingServers - Servers to stop.
 */
export async function stopTestingServers(testingServers: StartedPGliteServer[]) {
  await Promise.allSettled(testingServers.map((testingServer) => testingServer.stop()))
}
