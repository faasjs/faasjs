# PG Query Builder and Raw SQL Guide

Use this guide when building SQL queries with `@faasjs/pg` in FaasJS apps.

## Contents

- [Applicable Scenarios](#applicable-scenarios)
- [Default Workflow](#default-workflow)
- [Builder-First Example](#builder-first-example)
- [Raw SQL Fallback Example](#raw-sql-fallback-example)
- [Parameterized Update-expression Example](#parameterized-update-expression-example)
- [Rules](#rules)
- [See Also](#see-also)
- [Review Checklist](#review-checklist)

## Applicable Scenarios

- Creating or modifying SELECT, INSERT, UPDATE, DELETE, or UPSERT queries
- Adding joins, ordering, pagination, aggregation, or JSONB field selection
- Deciding whether the typed fluent API is sufficient or raw SQL is needed
- Choosing between `getClient` and `createClient`

## Default Workflow

1. Prefer `await getClient()` for the default client path. The built-in bootstrap reads `DATABASE_URL`, and tests can override that bootstrap lazily.
2. Start from `client.query('<table>')` and keep `select`, `where`, `join`, `orderBy`, `limit`, `offset`, and `returning` in builder methods when available.
3. Narrow results with `select(...)`, `first()`, `pluck(...)`, or explicit `returning` columns when the caller does not need full rows.
4. Use `whereRaw`, `orWhereRaw`, `orderByRaw`, or `client.raw(...)` only for expressions or statements the builder cannot represent directly.
5. Keep runtime values parameterized, and use `rawSql(...)` or `escapeIdentifier(...)` only for trusted SQL fragments or identifiers.

## Builder-First Example

```ts
const rows = await client
  .query('users')
  .select({ column: 'id', alias: 'userId' }, 'name', {
    column: 'metadata',
    fields: ['age'],
  })
  .leftJoin('profiles', 'users.id', 'profiles.user_id')
  .where('name', 'ILIKE', 'a%')
  .orderBy('id', 'ASC')
```

## Raw SQL Fallback Example

```ts
import { getClient } from '@faasjs/pg'

const client = await getClient()

await client.transaction(async (trx) => {
  await trx.raw('UPDATE users SET name = ? WHERE id = ?', 'Alice', 1)
  await trx.raw`INSERT INTO audit_logs (action, user_id) VALUES (${'rename_user'}, ${1})`
})
```

## Parameterized Update-expression Example

```ts
import { sql } from '@faasjs/pg'

await client
  .query('jobs')
  .where('id', jobId)
  .update({
    attempts: sql`${sql.ref('attempts')} + ${1}`,
    updated_at: sql`NOW()`,
  })
```

## Rules

### 1. Keep query shape and result shape aligned

- `select(...)`, `first()`, `pluck(...)`, and `returning` define what downstream code can safely assume.
- Use `{ column, alias }` when a scalar result key differs from its database column; JSON field selectors support the same `alias` behavior.
- If you extract a shared query helper, keep the narrowed result shape explicit instead of widening back to full rows.
- When contributing to `@faasjs/pg` itself, update runtime coverage and type coverage together.

### 2. Prefer typed clauses before raw SQL

- Use `where`, `orWhere`, `join`, `leftJoin`, `orderBy`, `count`, `first`, and `pluck` first.
- Prefer built-in operators for equality, ranges, arrays, pattern matching, and JSONB containment.
- Use raw clauses only for expressions such as `CASE`, SQL functions, predicates, or statements that do not map cleanly to the built-in surface.

### 3. Keep raw values parameterized and trusted boundaries explicit

- Use placeholders or template parameters for runtime values.
- `rawSql(...)` should be reserved for trusted SQL fragments that cannot be represented otherwise.
- SQL identifiers cannot be parameterized, so use `escapeIdentifier(...)` or a carefully bounded trusted fragment.
- Never interpolate end-user values into raw SQL strings.

### 4. Keep database bootstrap consistent across environments

- Prefer `await getClient()` for the default application client so the shared bootstrap path always goes through the registered async bootstrap. By default that bootstrap reads `process.env.DATABASE_URL`.
- Reach for `createClient(process.env.DATABASE_URL, options)` only when custom `postgres.js` options or multiple database connections are required.
- Treat `await getClient()` throwing as a signal that the shared bootstrap path was not configured.
- In tests, let `PgVitestPlugin()` register the lazy test bootstrap instead of building a separate testing-only connection path. If a suite also reads `process.env.DATABASE_URL` directly, call `await getClient()` first.

### 5. Preserve edge-case semantics

Do not replace these builder behaviors with truthiness checks or hand-built SQL that changes their meaning:

| Builder input                     | Required behavior                     |
| --------------------------------- | ------------------------------------- |
| `where(column, 'IN', [])`         | match no rows (`FALSE`)               |
| `where(column, 'NOT IN', [])`     | match all rows (`TRUE`)               |
| `limit(0)`                        | keep `LIMIT 0`, do not omit the limit |
| `first()` with no matching row    | return typed `null`                   |
| upsert with only conflict columns | emit `DO NOTHING`                     |

Add runtime and type coverage together when changing these cases.

### 6. Keep write queries guarded

- `update()` and `delete()` should keep explicit `where` conditions.
- Treat an unbounded mutation as a bug unless it is a deliberate migration or maintenance action.
- Do not remove or bypass the package's missing-where protection.

### 7. Keep update expressions parameterized

- Use the exported `sql` tag for atomic updates such as counters or database functions.
- Insert identifiers with `sql.ref(...)`; other interpolations are always bound values.
- Treat the static template text as trusted application SQL and never concatenate runtime input into it.
- Treat `sql` as a result-type escape hatch: TypeScript does not prove that the expression result matches the destination column. Review the SQL and execute it against PostgreSQL in tests.

### 8. Use `returning` only when the caller needs changed rows

- `insert`, `update`, and `upsert` return an empty result shape unless `returning` is requested.
- Keep `returning` columns explicit so the result type stays narrow and predictable.
- Prefer the minimum set of returned columns instead of `['*']` unless the caller truly needs the whole row.

### 9. Move repeated raw SQL back toward shared helpers or the builder

- If a raw query becomes common or reusable, consider whether it belongs in a shared helper or in the fluent query surface instead.
- Prefer one reviewed abstraction over many near-duplicate raw SQL snippets.
- When `@faasjs/pg` grows a clause helper that covers the same case, update app code to leave raw SQL behind.

### 10. Use query logging selectively

- The client logger is optional.
- Debug logging is appropriate for query timing, troubleshooting, or temporary diagnostics.
- Avoid coupling normal application logic to debug logging side effects.

## See Also

- [PG Table Types Guide](./pg-table-types.md) — declaration merging on `Tables` for type-safe query results
- [PG Transactions and Locking Guide](./pg-transactions-and-locking.md) — transaction modes, row locks, retries, and concurrency tests
- [PG Numeric Boundaries Guide](./pg-numeric-boundaries.md) — exact PostgreSQL numeric values and TypeScript boundaries
- [PG Schema and Migrations Guide](./pg-schema-and-migrations.md) — creating and running migrations
- [PG Testing Guide](./pg-testing.md) — testing with `PgVitestPlugin()`

## Review Checklist

- builder methods are used before falling back to raw SQL
- the result shape matches what the caller actually reads
- values stay parameterized and trusted SQL boundaries are explicit
- the default client bootstrap goes through `await getClient()` and the registered async bootstrap (`process.env.DATABASE_URL` by default)
- `select`, `first`, `pluck`, or explicit `returning` narrow rows when appropriate
- `update` and `delete` stay guarded by `where`
- empty arrays, zero limits, nullable `first()`, and conflict-only upserts keep their documented semantics
- update-expression values remain parameterized and their result types are verified at runtime
- shared query helpers or package changes keep runtime and type coverage aligned
