import { existsSync, globSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { Migrator, createClient } from '@faasjs/pg'
import type { TestProject } from 'vitest/node'

import { startPGliteServer, type StartedPGliteServer } from './pglite'
import { TYPED_PG_VITEST_DATABASE_URLS_KEY, type TypedPgVitestDatabaseUrls } from './plugin-context'
import { resolveVitestWorkerCount } from './vitest-worker-count'

async function startWorkerTestingServer(project: TestProject) {
  const testingServer = await startPGliteServer()
  const migrationsFolder = resolve(project.config.root, 'migrations')

  try {
    if (existsSync(migrationsFolder) && globSync(join(migrationsFolder, '*.ts')).length) {
      const client = createClient(testingServer.databaseUrl, {
        max: 1,
        ssl: false,
      })

      try {
        await new Migrator({ client, folder: migrationsFolder }).migrate()
      } finally {
        await client.quit()
      }
    }
  } catch (error) {
    await testingServer.stop()
    throw error
  }

  return testingServer
}

async function stopTestingServers(testingServers: StartedPGliteServer[]) {
  await Promise.allSettled(testingServers.map((testingServer) => testingServer.stop()))
}

/**
 * Vitest global setup for {@link TypedPgVitestPlugin}.
 *
 * A dedicated temporary database is created for each Vitest worker pool slot so file-parallel test
 * runs do not share mutable state.
 *
 * @param {TestProject} project - Active Vitest project.
 * @returns Teardown function that stops the temporary database servers.
 */
async function setup(project: TestProject) {
  const workerCount = resolveVitestWorkerCount(project)
  const testingServers: StartedPGliteServer[] = []
  const databaseUrls: TypedPgVitestDatabaseUrls = {}

  try {
    for (let workerId = 1; workerId <= workerCount; workerId += 1) {
      const testingServer = await startWorkerTestingServer(project)

      testingServers.push(testingServer)
      databaseUrls[String(workerId)] = testingServer.databaseUrl
    }
  } catch (error) {
    await stopTestingServers(testingServers)
    throw error
  }

  project.provide(TYPED_PG_VITEST_DATABASE_URLS_KEY, databaseUrls)

  return async () => {
    await stopTestingServers(testingServers)
  }
}

export default setup
