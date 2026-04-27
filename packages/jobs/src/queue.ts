import { randomUUID } from 'node:crypto'

import { type Client, getClient } from '@faasjs/pg'

import { resolveMaxAttempts, resolveQueue } from './options'
import { type EnqueueJobOptions, type InternalEnqueueJobOptions, type JobRecord } from './types'

const initializedClients = new WeakSet<Client>()
const initializingClients = new WeakMap<Client, Promise<void>>()

type JobsSchemaMigration = {
  version: number
  name: string
  up: (client: Client) => Promise<void>
}

const jobsSchemaMigrations: JobsSchemaMigration[] = [
  {
    version: 1,
    name: 'create_faasjs_jobs',
    async up(client) {
      await client.raw`
        CREATE TABLE IF NOT EXISTS faasjs_jobs (
          id uuid PRIMARY KEY,
          job_path text NOT NULL,
          queue text NOT NULL DEFAULT 'default',
          params jsonb NOT NULL DEFAULT '{}',
          status text NOT NULL,
          run_at timestamptz NOT NULL,
          priority integer NOT NULL DEFAULT 0,
          attempts integer NOT NULL DEFAULT 0,
          max_attempts integer NOT NULL DEFAULT 3,
          locked_by text,
          lease_id uuid,
          locked_until timestamptz,
          last_error text,
          idempotency_key text,
          cron_key text,
          scheduled_at timestamptz,
          created_at timestamptz NOT NULL DEFAULT NOW(),
          updated_at timestamptz NOT NULL DEFAULT NOW(),
          completed_at timestamptz,
          failed_at timestamptz
        )
      `

      await client.raw`
        CREATE INDEX IF NOT EXISTS faasjs_jobs_claim_idx
          ON faasjs_jobs (queue, status, run_at, priority DESC, created_at)
          WHERE status IN ('pending', 'running')
      `

      await client.raw`
        CREATE UNIQUE INDEX IF NOT EXISTS faasjs_jobs_idempotency_key_idx
          ON faasjs_jobs (idempotency_key)
          WHERE idempotency_key IS NOT NULL
      `

      await client.raw`
        CREATE UNIQUE INDEX IF NOT EXISTS faasjs_jobs_cron_idx
          ON faasjs_jobs (job_path, cron_key, scheduled_at)
          WHERE cron_key IS NOT NULL AND scheduled_at IS NOT NULL
      `
    },
  },
]

async function runJobsSchemaMigrations(client: Client): Promise<void> {
  await client.raw`
    CREATE TABLE IF NOT EXISTS faasjs_jobs_schema_migrations (
      version integer PRIMARY KEY,
      name text NOT NULL,
      migrated_at timestamptz NOT NULL DEFAULT NOW()
    )
  `

  await client.transaction(async (trx) => {
    await trx.raw`SELECT pg_advisory_xact_lock(802201, 1)`

    const appliedRows = await trx.raw<{
      version: number
    }>`SELECT version FROM faasjs_jobs_schema_migrations`
    const appliedVersions = new Set(appliedRows.map((row) => Number(row.version)))

    for (const migration of jobsSchemaMigrations) {
      if (appliedVersions.has(migration.version)) continue

      await migration.up(trx)
      await trx.raw(
        'INSERT INTO faasjs_jobs_schema_migrations (version, name) VALUES (?, ?)',
        migration.version,
        migration.name,
      )
      appliedVersions.add(migration.version)
    }
  })
}

export async function ensureJobsSchema(client?: Client): Promise<void> {
  const targetClient = client || (await getClient())

  if (initializedClients.has(targetClient)) return

  const existingInitialization = initializingClients.get(targetClient)

  if (existingInitialization) return existingInitialization

  const initializing = (async () => {
    await runJobsSchemaMigrations(targetClient)
    initializedClients.add(targetClient)
  })()

  initializingClients.set(targetClient, initializing)

  try {
    await initializing
  } finally {
    initializingClients.delete(targetClient)
  }
}

async function selectExistingJob(
  client: Client,
  jobPath: string,
  options: InternalEnqueueJobOptions,
): Promise<JobRecord | undefined> {
  if (options.idempotencyKey) {
    const [existing] = await client.raw<JobRecord>(
      'SELECT * FROM faasjs_jobs WHERE idempotency_key = ?',
      options.idempotencyKey,
    )

    return existing
  }

  if (options.cronKey && options.scheduledAt) {
    const [existing] = await client.raw<JobRecord>(
      'SELECT * FROM faasjs_jobs WHERE job_path = ? AND cron_key = ? AND scheduled_at = ?',
      jobPath,
      options.cronKey,
      options.scheduledAt,
    )

    return existing
  }
}

async function insertJob(
  client: Client,
  jobPath: string,
  params: unknown,
  options: InternalEnqueueJobOptions,
): Promise<JobRecord | undefined> {
  const id = randomUUID()
  const queue = resolveQueue(options.queue)
  const runAt = options.runAt ?? new Date()
  const priority = options.priority ?? 0
  const maxAttempts = resolveMaxAttempts(options.maxAttempts)
  const paramsValue = params ?? {}

  if (!Number.isInteger(priority)) throw Error('[jobs] priority must be an integer.')
  if (!jobPath.trim()) throw Error('[jobs] jobPath must not be empty.')

  const args = [
    id,
    jobPath,
    queue,
    paramsValue,
    runAt,
    priority,
    maxAttempts,
    options.idempotencyKey ?? null,
    options.cronKey ?? null,
    options.scheduledAt ?? null,
  ]
  const valuesSql = `
    VALUES (
      ?::uuid,
      ?,
      ?,
      ?::jsonb,
      'pending',
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )
  `
  const conflictSql = options.idempotencyKey
    ? 'ON CONFLICT (idempotency_key) WHERE idempotency_key IS NOT NULL DO NOTHING'
    : options.cronKey && options.scheduledAt
      ? `ON CONFLICT (job_path, cron_key, scheduled_at)
          WHERE cron_key IS NOT NULL AND scheduled_at IS NOT NULL
          DO NOTHING`
      : ''
  const [record] = await client.raw<JobRecord>(
    `
      INSERT INTO faasjs_jobs (
        id, job_path, queue, params, status, run_at, priority, max_attempts,
        idempotency_key, cron_key, scheduled_at
      )
      ${valuesSql}
      ${conflictSql}
      RETURNING *
    `,
    ...args,
  )

  return record
}

export async function enqueueJobInternal(
  jobPath: string,
  params: unknown = {},
  options: InternalEnqueueJobOptions = {},
): Promise<JobRecord> {
  const client = await getClient()

  await ensureJobsSchema(client)

  const inserted = await insertJob(client, jobPath, params, options)

  if (inserted) return inserted

  const existing = await selectExistingJob(client, jobPath, options)

  if (!existing) throw Error('[jobs] Failed to enqueue job.')

  return existing
}

/**
 * Enqueue a pending job by its `.job.ts` path-derived identifier.
 */
export async function enqueueJob(
  jobPath: string,
  params: unknown = {},
  options: EnqueueJobOptions = {},
): Promise<JobRecord> {
  return enqueueJobInternal(jobPath, params, options)
}
