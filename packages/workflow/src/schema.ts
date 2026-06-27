import { getClient, type Client } from '@faasjs/pg'

const initializedClients = new WeakSet<Client>()
const initializingClients = new WeakMap<Client, Promise<void>>()

type WorkflowSchemaMigration = {
  version: number
  name: string
  up: (client: Client) => Promise<void>
}

const workflowSchemaMigrations: WorkflowSchemaMigration[] = [
  {
    version: 1,
    name: 'create_faasjs_workflows',
    async up(client) {
      await client.raw`
        CREATE TABLE IF NOT EXISTS faasjs_workflows (
          id uuid PRIMARY KEY,
          type text NOT NULL,
          status text NOT NULL,
          root_step_id uuid,
          metadata jsonb NOT NULL DEFAULT '{}',
          version integer NOT NULL DEFAULT 0,
          created_at timestamptz NOT NULL DEFAULT NOW(),
          updated_at timestamptz NOT NULL DEFAULT NOW(),
          completed_at timestamptz,
          failed_at timestamptz,
          cancelled_at timestamptz,
          CONSTRAINT faasjs_workflows_id_type_unique UNIQUE (id, type)
        )
      `

      await client.raw`
        CREATE TABLE IF NOT EXISTS faasjs_workflow_steps (
          seq bigserial NOT NULL,
          id uuid PRIMARY KEY,
          workflow_id uuid NOT NULL,
          workflow_type text NOT NULL,
          name text NOT NULL,
          parent_id uuid,
          params jsonb NOT NULL DEFAULT '{}',
          data jsonb,
          status text NOT NULL,
          next_step_id uuid,
          fork_child_ids uuid[],
          locked_by text,
          lease_id uuid,
          locked_until timestamptz,
          error jsonb,
          created_at timestamptz NOT NULL DEFAULT NOW(),
          updated_at timestamptz NOT NULL DEFAULT NOW(),
          CONSTRAINT faasjs_workflow_steps_workflow_fk
            FOREIGN KEY (workflow_id, workflow_type)
            REFERENCES faasjs_workflows (id, type)
            ON DELETE CASCADE
        )
      `

      await client.raw`
        CREATE INDEX IF NOT EXISTS faasjs_workflow_steps_claim_idx
          ON faasjs_workflow_steps (workflow_type, status, locked_until, seq)
          WHERE status IN ('runnable', 'running')
      `
    },
  },
  {
    version: 2,
    name: 'add_faasjs_workflows_metadata',
    async up(client) {
      const [column] = await client.raw<{
        exists: boolean
      }>`
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = current_schema()
            AND table_name = 'faasjs_workflows'
            AND column_name = 'metadata'
        ) AS exists
      `

      if (column?.exists) return

      await client.raw`
        ALTER TABLE faasjs_workflows
        ADD COLUMN metadata jsonb NOT NULL DEFAULT '{}'
      `
    },
  },
]

async function runWorkflowSchemaMigrations(client: Client): Promise<void> {
  await client.raw`
    CREATE TABLE IF NOT EXISTS faasjs_workflow_schema_migrations (
      version integer PRIMARY KEY,
      name text NOT NULL,
      migrated_at timestamptz NOT NULL DEFAULT NOW()
    )
  `

  await client.transaction(async (trx) => {
    await trx.raw`SELECT pg_advisory_xact_lock(802201, 2)`

    const appliedRows = await trx.raw<{
      version: number
    }>`SELECT version FROM faasjs_workflow_schema_migrations`
    const appliedVersions = new Set(appliedRows.map((row) => Number(row.version)))

    for (const migration of workflowSchemaMigrations) {
      if (appliedVersions.has(migration.version)) continue

      await migration.up(trx)
      await trx.raw(
        'INSERT INTO faasjs_workflow_schema_migrations (version, name) VALUES (?, ?)',
        migration.version,
        migration.name,
      )
      appliedVersions.add(migration.version)
    }
  })
}

/**
 * Ensure the workflow database schema exists and is up-to-date.
 *
 * @param client - Optional PostgreSQL client. Defaults to the package default client.
 */
export async function ensureWorkflowSchema(client?: Client): Promise<void> {
  const targetClient = client || (await getClient())

  if (initializedClients.has(targetClient)) return

  const existingInitialization = initializingClients.get(targetClient)

  if (existingInitialization) return existingInitialization

  const initializing = (async () => {
    await runWorkflowSchemaMigrations(targetClient)
    initializedClients.add(targetClient)
  })()

  initializingClients.set(targetClient, initializing)

  try {
    await initializing
  } finally {
    initializingClients.delete(targetClient)
  }
}
