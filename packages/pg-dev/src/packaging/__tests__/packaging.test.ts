import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { describe, expect, it } from 'vitest'

const testDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(testDir, '..', '..', '..')
const workspaceRoot = resolve(packageRoot, '..', '..')

interface TypedPgDevPackageJson {
  exports: Record<
    string,
    {
      default: string
      types: string
    }
  >
}

function readTypedPgDevPackageJson() {
  return JSON.parse(
    readFileSync(join(packageRoot, 'package.json'), 'utf8'),
  ) as TypedPgDevPackageJson
}

describe('typed-pg-dev packaging', () => {
  it('exports the Vitest runtime helper entrypoints', () => {
    const packageJson = readTypedPgDevPackageJson()

    expect(packageJson.exports['./typed-pg-vitest-global-setup']).toEqual({
      types: './dist/typed-pg-vitest-global-setup.d.ts',
      default: './dist/typed-pg-vitest-global-setup.mjs',
    })
    expect(packageJson.exports['./typed-pg-vitest-setup']).toEqual({
      types: './dist/typed-pg-vitest-setup.d.ts',
      default: './dist/typed-pg-vitest-setup.mjs',
    })
  })

  it('packs the Vitest runtime helper entrypoints', async () => {
    const configModule = await import(pathToFileURL(join(workspaceRoot, 'vite.config.ts')).href)
    const packConfig = configModule.default.pack.find(
      (config: { cwd: string }) => config.cwd === join(workspaceRoot, 'packages', 'pg-dev'),
    )

    expect(packConfig?.entry).toMatchObject({
      index: './src/index.ts',
      'typed-pg-vitest-global-setup': './src/typed-pg-vitest-global-setup/index.ts',
      'typed-pg-vitest-setup': './src/typed-pg-vitest-setup/index.ts',
    })
  })
})
