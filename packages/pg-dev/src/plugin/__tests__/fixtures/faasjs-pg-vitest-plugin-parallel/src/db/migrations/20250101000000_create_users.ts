import { appendFileSync } from 'node:fs'

import type { SchemaBuilder } from '@faasjs/pg'

import { down, up as createUsers } from '../../../../create-users-migration'

export function up(builder: SchemaBuilder) {
  const migrationStateFile = process.env.PG_VITEST_MIGRATION_STATE_FILE

  if (migrationStateFile) appendFileSync(migrationStateFile, 'migrated\n')

  createUsers(builder)
}

export { down }
