import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const testDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(testDir, '..', '..', '..')
const workspaceRoot = resolve(packageRoot, '..', '..')
const tmpRoot = join(workspaceRoot, 'tmp')

function run(command: string, args: string[], cwd: string): string {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      FORCE_COLOR: '0',
    },
  })
}

describe('create-faas-app published package', () => {
  it('loads bundled templates from the packed CLI', () => {
    mkdirSync(tmpRoot, { recursive: true })

    const fixtureRoot = mkdtempSync(join(tmpRoot, 'create-faas-app-package-'))
    const packDestination = join(fixtureRoot, 'packed')
    const extractDestination = join(fixtureRoot, 'extracted')

    mkdirSync(packDestination)
    mkdirSync(extractDestination)

    try {
      run(
        'npx',
        ['vp', 'pack', '--filter', 'packages/create-faas-app', '--logLevel', 'warn'],
        workspaceRoot,
      )

      const tarballName = run(
        'npm',
        ['pack', '--silent', '--pack-destination', packDestination],
        packageRoot,
      ).trim()

      run(
        'tar',
        ['-xzf', join(packDestination, tarballName), '-C', extractDestination],
        workspaceRoot,
      )

      const packedPackageRoot = join(extractDestination, 'package')
      const output = run(
        process.execPath,
        [join(packedPackageRoot, 'index.mjs'), '--help'],
        workspaceRoot,
      )

      expect(output).toContain('Available:\nadmin, minimal')
      expect(existsSync(join(packedPackageRoot, 'template', 'admin'))).toBe(true)
      expect(existsSync(join(packedPackageRoot, 'template', 'minimal'))).toBe(true)
    } finally {
      rmSync(fixtureRoot, { force: true, recursive: true })
    }
  }, 30_000)
})
