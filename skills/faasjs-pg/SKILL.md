---
name: faasjs-pg
description: 'Use when working with @faasjs/pg or PostgreSQL in FaasJS: Tables declaration merging, QueryBuilder, select aliases, parameterized sql expressions, raw SQL, numeric/decimal/bigint boundaries, transaction isolation and read-only modes, row locks, concurrency, migrations, SchemaBuilder, TableBuilder, faasjs-pg CLI, PgVitestPlugin, and database type tests.'
---

# FaasJS PostgreSQL

## Default Workflow

1. Keep table declarations, migrations, queries, and tests aligned.
2. Prefer typed `QueryBuilder` clauses before raw SQL.
3. Parameterize raw SQL values and keep trusted boundaries explicit.
4. Keep migrations deterministic, lexically sortable, and reversible where possible.
5. Pair runtime database assertions with type assertions when query inference is part of the behavior.
6. Use explicit transactions and concurrency tests when atomicity or row locking matters.

## Load These References

- Declaration merging on `Tables` and concrete row shapes: `references/guidelines/pg-table-types.md`.
- `QueryBuilder`, aliases, raw SQL, update expressions, `returning`, and edge semantics: `references/guidelines/pg-query-builder.md`.
- Transaction modes, transaction client lifetime, row locks, retry ownership, and concurrency tests: `references/guidelines/pg-transactions-and-locking.md`.
- Exact `numeric`, `decimal`, and `bigint` values across TypeScript and API boundaries: `references/guidelines/pg-numeric-boundaries.md`.
- Timestamped migrations, `SchemaBuilder`, `TableBuilder`, and schema execution: `references/guidelines/pg-schema-and-migrations.md`.
- `PgVitestPlugin()`, `DATABASE_URL`, isolated data, and `expectTypeOf(...)`: `references/guidelines/pg-testing.md`.

## Gotchas

- Treat `Tables` declarations as the source of truth for query inference.
- Use raw SQL deliberately; move repeated raw SQL back toward shared helpers or builder clauses.
- Keep write queries and transactions guarded by caller scope and expected failure handling; never let a transaction client escape its callback.
- When a transaction also calls `enqueueJob`, load FaasJS API And Jobs and test rollback of both business data and the job row.
- `DATABASE_URL` is required for migration and PG integration test commands.

## Validation

- Run `npx faasjs-pg migrate` when schema changes need migration verification and `DATABASE_URL` is available.
- Run focused PG tests with `vp test <pattern>`.
- Include `expectTypeOf(...)` when changing type-sensitive query behavior.
- Use overlapping real transactions for lock or concurrency behavior; generated SQL assertions alone are insufficient.
