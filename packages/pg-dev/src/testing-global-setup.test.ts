import { access, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { PG_VITEST_SNAPSHOT_DIR_CONTEXT_KEY } from './plugin-context'
import setupPgVitestGlobal from './testing-global-setup'

describe('PgVitest global setup', () => {
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

  it('provides a lazy snapshot directory and cleans it during teardown', async () => {
    const projectTmpDir = await mkdtemp(join(tmpdir(), 'faasjs-pg-dev-global-'))
    let rerunHook: (() => void | Promise<void>) | undefined
    const provide = vi.fn<(key: string, value: string) => void>()

    temporaryDirectories.push(projectTmpDir)

    const teardown = await setupPgVitestGlobal({
      onTestsRerun(callback) {
        rerunHook = callback
      },
      provide,
      tmpDir: projectTmpDir,
    })
    const snapshotDir = join(projectTmpDir, 'faasjs-pg-dev')

    expect(provide).toHaveBeenCalledWith(PG_VITEST_SNAPSHOT_DIR_CONTEXT_KEY, snapshotDir)
    await expect(access(snapshotDir)).resolves.toBeUndefined()

    await rerunHook?.()
    await expect(access(snapshotDir)).resolves.toBeUndefined()

    await teardown()
    await expect(access(snapshotDir)).rejects.toMatchObject({ code: 'ENOENT' })
  })
})
