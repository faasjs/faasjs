---
name: faasjs-pg
description: 'Use when working with @faasjs/pg or PostgreSQL in FaasJS: Tables declaration merging, table row types, QueryBuilder, raw SQL fallbacks, transactions, migrations, SchemaBuilder, TableBuilder, faasjs-pg CLI commands, DATABASE_URL, PgVitestPlugin, and expectTypeOf database tests.'
---

# FaasJS PostgreSQL

## Default Workflow

1. Keep table declarations, migrations, queries, and tests aligned.
2. Prefer typed `QueryBuilder` clauses before raw SQL.
3. Parameterize raw SQL values and keep trusted boundaries explicit.
4. Keep migrations deterministic, lexically sortable, and reversible where possible.
5. Pair runtime database assertions with type assertions when query inference is part of the behavior.

## Load These References

- Declaration merging on `Tables` and concrete row shapes: `references/guidelines/pg-table-types.md`.
- `QueryBuilder`, raw SQL, transactions, `returning`, and query logging: `references/guidelines/pg-query-builder.md`.
- Timestamped migrations, `SchemaBuilder`, `TableBuilder`, and schema execution: `references/guidelines/pg-schema-and-migrations.md`.
- `PgVitestPlugin()`, `DATABASE_URL`, isolated data, and `expectTypeOf(...)`: `references/guidelines/pg-testing.md`.

## Gotchas

- Treat `Tables` declarations as the source of truth for query inference.
- Use raw SQL deliberately; move repeated raw SQL back toward shared helpers or builder clauses.
- Keep write queries and transactions guarded by caller scope and expected failure handling.
- `DATABASE_URL` is required for migration and PG integration test commands.

## Validation

- Run `npx faasjs-pg migrate` when schema changes need migration verification and `DATABASE_URL` is available.
- Run focused PG tests with `vp test <pattern>`.
- Include `expectTypeOf(...)` when changing type-sensitive query behavior.
