import { mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

import { expect, it } from 'vitest'

import { createFixturePostgres, requireFixtureDatabaseUrl } from '../shared'

const PARALLEL_WORKER_COUNT = 2
const PARALLEL_READY_TIMEOUT_MS = 10_000
const PARALLEL_STATE_DIR_ENV_NAME = 'TYPED_PG_VITEST_PARALLEL_STATE_DIR'

function resolveWorkerId() {
  return process.env.VITEST_POOL_ID ?? process.env.VITEST_WORKER_ID ?? 'unknown'
}

function resolveStateDir() {
  return (
    process.env[PARALLEL_STATE_DIR_ENV_NAME] ?? join(tmpdir(), 'typed-pg-vitest-plugin-parallel')
  )
}

async function waitForAllWorkers(stateDir: string) {
  const timeoutAt = Date.now() + PARALLEL_READY_TIMEOUT_MS

  while (Date.now() < timeoutAt) {
    const readyFiles = readdirSync(stateDir).filter((file) => file.endsWith('.ready'))

    if (readyFiles.length >= PARALLEL_WORKER_COUNT) return

    await delay(50)
  }

  throw Error('Timed out waiting for the parallel Vitest workers to become ready')
}

export function defineParallelIsolationCase(caseName: string, userId: number) {
  const stateDir = resolveStateDir()
  const databaseUrl = requireFixtureDatabaseUrl()
  const workerId = resolveWorkerId()

  it(`isolates ${caseName}`, async () => {
    mkdirSync(stateDir, { recursive: true })
    writeFileSync(join(stateDir, `${caseName}.ready`), workerId)
    await waitForAllWorkers(stateDir)

    const sql = createFixturePostgres(databaseUrl)

    try {
      await sql`INSERT INTO users (id, name) VALUES (${userId}, ${caseName})`
      await delay(150)
      expect(await sql`SELECT COUNT(*)::integer AS count FROM users`).toEqual([{ count: 1 }])
      writeFileSync(
        join(stateDir, `${caseName}.json`),
        JSON.stringify({ caseName, workerId, databaseUrl }),
      )
    } finally {
      await sql.end({ timeout: 1 })
    }
  }, 15_000)
}
