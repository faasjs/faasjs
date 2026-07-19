import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { setTimeout as wait } from 'node:timers/promises'

const LOCK_DIRECTORY_NAME = 'migration-snapshot.lock'
const LOCK_STALE_AFTER_MS = 60_000
const SNAPSHOT_ERROR_FILE_NAME = 'migration-snapshot.error'
const SNAPSHOT_FILE_NAME = 'migration-snapshot.tar'
const WAIT_INTERVAL_MS = 25

function snapshotPaths(snapshotDir: string) {
  return {
    error: join(snapshotDir, SNAPSHOT_ERROR_FILE_NAME),
    lock: join(snapshotDir, LOCK_DIRECTORY_NAME),
    snapshot: join(snapshotDir, SNAPSHOT_FILE_NAME),
  }
}

async function readSnapshot(snapshotFile: string) {
  try {
    return new Blob([await readFile(snapshotFile)])
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return

    throw error
  }
}

async function readSnapshotError(errorFile: string) {
  try {
    return await readFile(errorFile, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return

    throw error
  }
}

async function acquireSnapshotLock(lockDirectory: string) {
  try {
    await mkdir(lockDirectory)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') return false

    throw error
  }
}

async function isSnapshotLockStale(lockDirectory: string) {
  try {
    const lockStats = await stat(lockDirectory)

    return Date.now() - lockStats.mtimeMs > LOCK_STALE_AFTER_MS
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false

    throw error
  }
}

function serializeSnapshotError(error: unknown) {
  if (error instanceof Error) return error.stack ?? error.message

  return String(error)
}

async function buildSnapshot(
  snapshotDir: string,
  createSnapshot: () => Promise<Blob>,
): Promise<Blob> {
  const paths = snapshotPaths(snapshotDir)
  const partialSnapshotFile = join(
    snapshotDir,
    `${SNAPSHOT_FILE_NAME}.${process.pid}.${randomUUID()}.partial`,
  )

  await rm(paths.error, { force: true })

  try {
    const snapshot = await createSnapshot()
    const snapshotBytes = new Uint8Array(await snapshot.arrayBuffer())

    await writeFile(partialSnapshotFile, snapshotBytes)
    await rename(partialSnapshotFile, paths.snapshot)

    return new Blob([snapshotBytes])
  } catch (error) {
    await writeFile(paths.error, serializeSnapshotError(error))
    throw error
  } finally {
    await rm(partialSnapshotFile, { force: true })
    await rm(paths.lock, { force: true, recursive: true })
  }
}

async function waitForSnapshot(
  snapshotDir: string,
  createSnapshot: () => Promise<Blob>,
): Promise<Blob> {
  const paths = snapshotPaths(snapshotDir)

  while (true) {
    const snapshot = await readSnapshot(paths.snapshot)

    if (snapshot) return snapshot

    try {
      await stat(paths.lock)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error

      const snapshotError = await readSnapshotError(paths.error)

      if (snapshotError) {
        throw Error(`Failed to create the shared PGlite migration snapshot:\n${snapshotError}`)
      }

      return getOrCreateMigrationSnapshot(snapshotDir, createSnapshot)
    }

    if (await isSnapshotLockStale(paths.lock)) {
      await rm(paths.lock, { force: true, recursive: true })
      return getOrCreateMigrationSnapshot(snapshotDir, createSnapshot)
    }

    await wait(WAIT_INTERVAL_MS)
  }
}

/**
 * Returns the run-scoped migration snapshot, creating it exactly once across Vitest workers.
 *
 * Snapshot publication uses an atomic rename and a filesystem lock so both `threads` and
 * `forks` pools can safely race on the first database-using test file. A failed build is
 * reported to current waiters while a later bootstrap call can retry from scratch.
 *
 * @param {string} snapshotDir - Shared temporary directory provided by Vitest global setup.
 * @param {() => Promise<Blob>} createSnapshot - Builds a migrated PGlite data directory dump.
 */
export async function getOrCreateMigrationSnapshot(
  snapshotDir: string,
  createSnapshot: () => Promise<Blob>,
): Promise<Blob> {
  await mkdir(snapshotDir, { recursive: true })

  const paths = snapshotPaths(snapshotDir)
  const snapshot = await readSnapshot(paths.snapshot)

  if (snapshot) return snapshot

  if (await acquireSnapshotLock(paths.lock)) {
    return buildSnapshot(snapshotDir, createSnapshot)
  }

  return waitForSnapshot(snapshotDir, createSnapshot)
}
