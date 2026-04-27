import { randomUUID } from 'node:crypto'

import { type Client, getClient } from '@faasjs/pg'

import { resolveMaxAttempts, resolveQueue } from './options'
import { type EnqueueJobOptions, type InternalEnqueueJobOptions, type JobRecord } from './types'

const initializedClients = new WeakSet<Client>()
const initializingClients = new WeakMap<Client, Promise<void>>()

function assertNonEmpty(value: string, label: string): void {
  if (!value.trim()) throw Error(`[jobs] ${label} must not be empty.`)
}

function resolvePriority(priority: number | undefined): number {
  if (priority === undefined) return 0
  if (!Number.isInteger(priority)) throw Error('[jobs] priority must be an integer.')

  return priority
}

async function initializeSchema(client: Client): Promise<void> {
  await client.raw`
    CREATE TABLE IF NOT EXISTS faasjs_jobs (
      id uuid PRIMARY KEY,
      job_path text NOT NULL,
      queue text NOT NULL DEFAULT 'default',
      payload jsonb NOT NULL DEFAULT '{}',
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
}

export async function ensureJobsSchema(client?: Client): Promise<void> {
  const targetClient = client || (await getClient())

  if (initializedClients.has(targetClient)) return

  const existingInitialization = initializingClients.get(targetClient)

  if (existingInitialization) return existingInitialization

  const initializing = (async () => {
    await initializeSchema(targetClient)
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
  payload: unknown,
  options: InternalEnqueueJobOptions,
): Promise<JobRecord | undefined> {
  const id = randomUUID()
  const queue = resolveQueue(options.queue)
  const runAt = options.runAt ?? new Date()
  const priority = resolvePriority(options.priority)
  const maxAttempts = resolveMaxAttempts(options.maxAttempts)
  const payloadValue = payload ?? {}

  assertNonEmpty(jobPath, 'jobPath')

  const args = [
    id,
    jobPath,
    queue,
    payloadValue,
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

  if (options.idempotencyKey) {
    const [record] = await client.raw<JobRecord>(
      `
        INSERT INTO faasjs_jobs (
          id, job_path, queue, payload, status, run_at, priority, max_attempts,
          idempotency_key, cron_key, scheduled_at
        )
        ${valuesSql}
        ON CONFLICT (idempotency_key) WHERE idempotency_key IS NOT NULL DO NOTHING
        RETURNING *
      `,
      ...args,
    )

    return record
  }

  if (options.cronKey && options.scheduledAt) {
    const [record] = await client.raw<JobRecord>(
      `
        INSERT INTO faasjs_jobs (
          id, job_path, queue, payload, status, run_at, priority, max_attempts,
          idempotency_key, cron_key, scheduled_at
        )
        ${valuesSql}
        ON CONFLICT (job_path, cron_key, scheduled_at)
          WHERE cron_key IS NOT NULL AND scheduled_at IS NOT NULL
          DO NOTHING
        RETURNING *
      `,
      ...args,
    )

    return record
  }

  const [record] = await client.raw<JobRecord>(
    `
      INSERT INTO faasjs_jobs (
        id, job_path, queue, payload, status, run_at, priority, max_attempts,
        idempotency_key, cron_key, scheduled_at
      )
      ${valuesSql}
      RETURNING *
    `,
    ...args,
  )

  return record
}

export async function enqueueJobInternal(
  jobPath: string,
  payload: unknown = {},
  options: InternalEnqueueJobOptions = {},
): Promise<JobRecord> {
  const client = await getClient()

  await ensureJobsSchema(client)

  const inserted = await insertJob(client, jobPath, payload, options)

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
  payload: unknown = {},
  options: EnqueueJobOptions = {},
): Promise<JobRecord> {
  return enqueueJobInternal(jobPath, payload, options)
}
