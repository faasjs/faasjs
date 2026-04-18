import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { isPathInsideRoot } from '../index'

describe('isPathInsideRoot', () => {
  it('should allow in-root paths and reject traversal and symlink escapes', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-is-path-inside-root-'))
    const publicRoot = join(root, 'public')
    const outsideRoot = join(root, 'outside')

    await mkdir(publicRoot, {
      recursive: true,
    })
    await mkdir(outsideRoot, {
      recursive: true,
    })

    await writeFile(join(outsideRoot, 'secret.txt'), 'secret', 'utf8')
    await symlink(outsideRoot, join(publicRoot, 'linked'))

    try {
      expect(isPathInsideRoot(join(publicRoot, 'index.html'), publicRoot)).toBe(true)
      expect(isPathInsideRoot(join(publicRoot, '..', 'outside', 'secret.txt'), publicRoot)).toBe(
        false,
      )
      expect(isPathInsideRoot(join(publicRoot, 'linked', 'secret.txt'), publicRoot)).toBe(false)
    } finally {
      await rm(root, {
        recursive: true,
        force: true,
      })
    }
  })
})
