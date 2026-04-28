import type { TestProject } from 'vitest/node'

import {
  TYPED_PG_VITEST_DATABASE_URLS_KEY,
  type TypedPgVitestDatabaseUrls,
} from '../plugin-context'
import { startTestingServer, stopTestingServers } from '../testing-server'
import { resolveVitestWorkerCount } from '../vitest-worker-count'

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
  const testingServers: Awaited<ReturnType<typeof startTestingServer>>[] = []
  const databaseUrls: TypedPgVitestDatabaseUrls = {}

  try {
    for (let workerId = 1; workerId <= workerCount; workerId += 1) {
      const testingServer = await startTestingServer(project.config.root)

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
