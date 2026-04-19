import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

import { TypedPgVitestPlugin } from '../../plugin'

const fixturesDir = dirname(fileURLToPath(import.meta.url))
const typedPgEntry = resolve(fixturesDir, '..', '..', '..', '..', 'pg', 'src', 'index.ts')
const nodeUtilsLoggerEntry = resolve(
  fixturesDir,
  '..',
  '..',
  '..',
  '..',
  'node-utils',
  'src',
  'logger.ts',
)

export function createFixtureVitestConfig(test: Record<string, unknown>) {
  return defineConfig({
    resolve: {
      alias: {
        '@faasjs/pg': typedPgEntry,
        '@faasjs/node-utils': nodeUtilsLoggerEntry,
      },
    },
    plugins: [TypedPgVitestPlugin()],
    test,
  })
}
