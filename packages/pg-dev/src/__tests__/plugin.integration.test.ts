import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')
const basicFixtureDir = join(fixturesDir, 'typed-pg-vitest-plugin')
const parallelFixtureDir = join(fixturesDir, 'typed-pg-vitest-plugin-parallel')
const rawSqlFixtureDir = join(fixturesDir, 'typed-pg-vitest-plugin-raw-sql')
const moduleRequire = createRequire(import.meta.url)
const vitestBin = join(dirname(moduleRequire.resolve('vitest/package.json')), 'vitest.mjs')

interface ParallelFixtureResult {
  caseName: string
  databaseUrl: string
  workerId: string
}

function runFixture(cwd: string, config: string, env: Record<string, string> = {}) {
  return execFileSync(process.execPath, [vitestBin, 'run', '--config', config], {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      FORCE_COLOR: '0',
      ...env,
    },
  })
}

function readParallelFixtureResults(parallelStateDir: string) {
  return readdirSync(parallelStateDir)
    .filter((file) => file.endsWith('.json'))
    .map(
      (file) =>
        JSON.parse(readFileSync(join(parallelStateDir, file), 'utf8')) as ParallelFixtureResult,
    )
}

describe('TypedPgVitestPlugin integration', () => {
  it('creates a temporary database, runs migrations, and clears data before each test', () => {
    const output = runFixture(basicFixtureDir, 'vitest.config.ts')

    expect(output).toContain('2 passed')
  }, 20_000)

  it('creates separate temporary databases per Vitest worker', () => {
    const parallelStateDir = mkdtempSync(join(tmpdir(), 'typed-pg-vitest-plugin-parallel-'))

    try {
      const output = runFixture(parallelFixtureDir, 'vitest.config.ts', {
        TYPED_PG_VITEST_PARALLEL_STATE_DIR: parallelStateDir,
      })
      const results = readParallelFixtureResults(parallelStateDir)

      expect(output).toContain('2 passed')
      expect(results).toHaveLength(2)
      expect(new Set(results.map((result) => result.workerId)).size).toBe(2)
      expect(new Set(results.map((result) => result.databaseUrl)).size).toBe(2)
    } finally {
      rmSync(parallelStateDir, { force: true, recursive: true })
    }
  }, 20_000)

  it('supports raw SQL migrations through SchemaBuilder.run', () => {
    const output = runFixture(rawSqlFixtureDir, 'vitest.config.ts')

    expect(output).toContain('1 passed')
  }, 20_000)
})
