import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

import { PgVitestPlugin } from '../index'

const fixturesDir = dirname(fileURLToPath(import.meta.url))
const pgEntry = resolve(fixturesDir, '..', '..', '..', '..', 'pg', 'src', 'index.ts')
const nodeUtilsLoggerEntry = resolve(
  fixturesDir,
  '..',
  '..',
  '..',
  '..',
  'node-utils',
  'src',
  'logger',
  'index.ts',
)

export function createFixtureVitestConfig(test: Record<string, unknown>) {
  return defineConfig({
    resolve: {
      alias: {
        '@faasjs/pg': pgEntry,
        '@faasjs/node-utils': nodeUtilsLoggerEntry,
      },
    },
    plugins: [PgVitestPlugin()],
    test,
  })
}
