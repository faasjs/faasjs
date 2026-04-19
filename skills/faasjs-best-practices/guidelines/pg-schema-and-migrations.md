# PG Schema and Migrations Guide

When implementing or reviewing DDL with `@faasjs/pg`, default to `SchemaBuilder`, `TableBuilder`, and timestamped migration files.

## Use This Guide When

- creating or updating migrations
- changing tables, columns, indexes, or constraints
- deciding whether a schema change should use builder helpers or raw SQL
- reviewing rollback expectations for an app-level schema change

## Default Workflow

1. Create a timestamped `.ts` migration file, usually with `faasjs-pg new <name>`.
2. Implement `up(builder)` with `SchemaBuilder` and `TableBuilder` helpers first.
3. Implement `down(builder)` for rollback when practical.
4. Keep related DDL in one builder run so it stays transactional.
5. Fall back to `raw()` only for SQL the current helpers do not support.

## Minimal Example

```ts
import type { SchemaBuilder } from '@faasjs/pg'

export function up(builder: SchemaBuilder) {
  builder.createTable('users', (table) => {
    table.string('id').primary()
    table.string('name')
    table.jsonb('metadata').defaultTo('{}')
    table.timestamps()
    table.index('name')
  })
}

export function down(builder: SchemaBuilder) {
  builder.dropTable('users')
}
```

## Rules

### 1. Keep migration filenames lexically sortable

- Migration files should remain timestamp-based and sortable by filename.
- Prefer the generated `faasjs-pg new <name>` naming pattern unless there is a strong reason not to.
- Avoid custom naming schemes that break lexical ordering.

### 2. Prefer builder helpers over handwritten DDL

- Use `createTable`, `alterTable`, `renameTable`, `dropTable`, and `TableBuilder` column helpers first.
- Use `specificType(...)` when the schema needs a PostgreSQL type not covered by a built-in helper.
- Use raw DDL only for unsupported features or carefully scoped one-off statements.

### 3. Preserve transactional schema execution

- `SchemaBuilder.run()` executes accumulated statements in a single transaction.
- Write migrations assuming the batch should succeed or fail as one unit.
- Do not split one logical schema change across unrelated builder runs unless partial application is intentional.

### 4. Keep migrations deterministic and reversible

- `up` and `down` should be direct, readable descriptions of the schema transition.
- Avoid time-sensitive or environment-sensitive SQL inside migrations unless it is explicitly required.
- Prefer reversible changes when practical so `down()` can restore the previous state.

### 5. Keep migration history semantics stable

- `typed_pg_migrations` is the source of migration history.
- `migrate()` applies all pending files, `up()` applies the next pending file, and `down()` rolls back the latest recorded file.
- Treat those behaviors as the default mental model for app code, tooling, and troubleshooting.

## Review Checklist

- the migration file name remains timestamp-sorted
- `up` and `down` are both present when rollback is practical
- builder helpers are used before raw DDL
- schema changes expect `SchemaBuilder.run()` to be atomic
- risky schema changes are covered by focused migration or integration tests

## Read Next

- [PG Testing Guide](./pg-testing.md)
- [@faasjs/pg package reference](../references/packages/pg/README.md)
- [SchemaBuilder](../references/packages/pg/classes/SchemaBuilder.md)
- [TableBuilder](../references/packages/pg/classes/TableBuilder.md)
- [Migrator](../references/packages/pg/classes/Migrator.md)
- [Client](../references/packages/pg/classes/Client.md)
