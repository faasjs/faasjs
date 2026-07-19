import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

import { PG_VITEST_SNAPSHOT_DIR_CONTEXT_KEY } from './plugin-context'

interface PgVitestGlobalSetupProject {
  onTestsRerun(callback: () => void | Promise<void>): void
  provide(key: string, value: string): void
  tmpDir: string
}

/**
 * Creates and publishes a project-scoped directory for the lazy migration snapshot.
 *
 * The directory itself is cheap: PGlite and migrations are only started by the first test file
 * that requests a database. Watch reruns invalidate the snapshot so changed migrations are
 * applied on the next database bootstrap.
 */
export default async function setupPgVitestGlobal(project: PgVitestGlobalSetupProject) {
  const snapshotDir = join(project.tmpDir, 'faasjs-pg-dev')
  const resetSnapshotDir = async () => {
    await rm(snapshotDir, { force: true, recursive: true })
    await mkdir(snapshotDir, { recursive: true })
  }

  await resetSnapshotDir()
  project.provide(PG_VITEST_SNAPSHOT_DIR_CONTEXT_KEY, snapshotDir)
  project.onTestsRerun(resetSnapshotDir)

  return async () => {
    await rm(snapshotDir, { force: true, recursive: true })
  }
}
