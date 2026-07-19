import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as wait } from 'node:timers/promises'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { getOrCreateMigrationSnapshot } from '../../migration-snapshot'

describe('migration snapshot cache', () => {
  const temporaryDirectories: string[] = []

  afterEach(async () => {
    await Promise.all(
      temporaryDirectories.splice(0).map((directory) =>
        rm(directory, {
          force: true,
          recursive: true,
        }),
      ),
    )
  })

  async function createSnapshotDir() {
    const directory = await mkdtemp(join(tmpdir(), 'faasjs-pg-dev-snapshot-'))

    temporaryDirectories.push(directory)

    return directory
  }

  it('publishes one snapshot when workers race', async () => {
    const snapshotDir = await createSnapshotDir()
    const createSnapshot = vi.fn<() => Promise<Blob>>(async () => {
      await wait(50)
      return new Blob(['migrated database'])
    })

    const snapshots = await Promise.all([
      getOrCreateMigrationSnapshot(snapshotDir, createSnapshot),
      getOrCreateMigrationSnapshot(snapshotDir, createSnapshot),
      getOrCreateMigrationSnapshot(snapshotDir, createSnapshot),
    ])

    expect(createSnapshot).toHaveBeenCalledTimes(1)
    await expect(Promise.all(snapshots.map((snapshot) => snapshot.text()))).resolves.toEqual([
      'migrated database',
      'migrated database',
      'migrated database',
    ])
  })

  it('allows a later bootstrap to retry after snapshot creation fails', async () => {
    const snapshotDir = await createSnapshotDir()
    const createSnapshot = vi
      .fn<() => Promise<Blob>>()
      .mockRejectedValueOnce(Error('migration failed'))
      .mockResolvedValueOnce(new Blob(['recovered database']))

    await expect(getOrCreateMigrationSnapshot(snapshotDir, createSnapshot)).rejects.toThrowError(
      'migration failed',
    )

    const snapshot = await getOrCreateMigrationSnapshot(snapshotDir, createSnapshot)

    expect(createSnapshot).toHaveBeenCalledTimes(2)
    await expect(snapshot.text()).resolves.toBe('recovered database')
  })
})
