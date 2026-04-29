import type { TestProject } from 'vitest/node'

import { startPGliteServer, type StartedPGliteServer } from '../../../pg-dev/src/pglite'
import {
  PG_VITEST_DATABASE_URLS_KEY,
  type PgVitestDatabaseUrls,
} from '../../../pg-dev/src/plugin-context'
import { resolveVitestWorkerCount } from '../../../pg-dev/src/vitest-worker-count'

async function stopTestingServers(testingServers: StartedPGliteServer[]) {
  await Promise.allSettled(testingServers.map((testingServer) => testingServer.stop()))
}

export default async function globalSetup(project: TestProject) {
  const workerCount = resolveVitestWorkerCount(project)
  const testingServers: StartedPGliteServer[] = []
  const databaseUrls: PgVitestDatabaseUrls = {}

  try {
    for (let workerId = 1; workerId <= workerCount; workerId += 1) {
      const testingServer = await startPGliteServer()

      testingServers.push(testingServer)
      databaseUrls[String(workerId)] = testingServer.databaseUrl
    }
  } catch (error) {
    await stopTestingServers(testingServers)
    throw error
  }

  project.provide(PG_VITEST_DATABASE_URLS_KEY, databaseUrls)

  return async () => {
    await stopTestingServers(testingServers)
  }
}
