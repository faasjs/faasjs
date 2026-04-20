# PG Query Builder and Raw SQL Guide

When implementing or reviewing `@faasjs/pg` query code, default to the fluent `QueryBuilder` surface, and fall back to `client.raw(...)` only when the builder cannot express the SQL cleanly.

## Use This Guide When

- creating or updating `SELECT`, `INSERT`, `UPDATE`, `DELETE`, or `UPSERT` queries
- adding joins, ordering, pagination, aggregates, JSONB field selection, or custom predicates
- deciding whether a query can stay inside the typed fluent API or needs a raw SQL fragment
- choosing between `getClient()` and `createClient(...)`, or reviewing transaction boundaries

## Default Workflow

1. Set `DATABASE_URL` in the environment and prefer `getClient()` so app code and tests share one bootstrap path.
2. Start from `client.query('<table>')` and keep `select`, `where`, `join`, `orderBy`, `limit`, `offset`, and `returning` in builder methods when available.
3. Narrow results with `select(...)`, `first()`, `pluck(...)`, or explicit `returning` columns when the caller does not need full rows.
4. Use `whereRaw`, `orWhereRaw`, `orderByRaw`, or `client.raw(...)` only for expressions or statements the builder cannot represent directly.
5. Keep runtime values parameterized, and use `rawSql(...)` or `escapeIdentifier(...)` only for trusted SQL fragments or identifiers.
6. Wrap multi-step read-write flows in `client.transaction(...)` when atomicity matters.

## Builder-First Example

```ts
const rows = await client
  .query('users')
  .select('id', 'name', { column: 'metadata', fields: ['age'] })
  .leftJoin('profiles', 'users.id', 'profiles.user_id')
  .where('name', 'ILIKE', 'a%')
  .orderBy('id', 'ASC')
```

## Raw SQL Fallback Example

```ts
import { getClient } from '@faasjs/pg'

const client = getClient()

await client.transaction(async (trx) => {
  await trx.raw('UPDATE users SET name = ? WHERE id = ?', 'Alice', 1)
  await trx.raw`INSERT INTO audit_logs (action, user_id) VALUES (${'rename_user'}, ${1})`
})
```

## Rules

### 1. Keep query shape and result shape aligned

- `select(...)`, `first()`, `pluck(...)`, and `returning` define what downstream code can safely assume.
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

- Prefer `getClient()` for the default application client so the shared bootstrap path stays tied to `process.env.DATABASE_URL`.
- Reach for `createClient(process.env.DATABASE_URL, options)` only when custom `postgres.js` options or multiple database connections are required.
- Treat `getClient()` throwing as a signal that the shared bootstrap path was not configured.
- In tests, let `TypedPgVitestPlugin()` populate `DATABASE_URL` instead of building a separate testing-only connection path.

### 5. Keep write queries and transactions guarded

- `update()` and `delete()` should keep explicit `where` conditions.
- Treat an unbounded mutation as a bug unless it is a deliberate migration or maintenance action.
- Do not remove or bypass the package's missing-where protection.
- Use `client.transaction(...)` for multi-step DML or mixed read-write flows that must succeed or fail together.

### 6. Use `returning` only when the caller needs changed rows

- `insert`, `update`, and `upsert` return an empty result shape unless `returning` is requested.
- Keep `returning` columns explicit so the result type stays narrow and predictable.
- Prefer the minimum set of returned columns instead of `['*']` unless the caller truly needs the whole row.

### 7. Move repeated raw SQL back toward shared helpers or the builder

- If a raw query becomes common or reusable, consider whether it belongs in a shared helper or in the fluent query surface instead.
- Prefer one reviewed abstraction over many near-duplicate raw SQL snippets.
- When `@faasjs/pg` grows a clause helper that covers the same case, update app code to leave raw SQL behind.

### 8. Use query logging selectively

- The client logger is optional.
- Debug logging is appropriate for query timing, troubleshooting, or temporary diagnostics.
- Avoid coupling normal application logic to debug logging side effects.

## Review Checklist

- builder methods are used before falling back to raw SQL
- the result shape matches what the caller actually reads
- values stay parameterized and trusted SQL boundaries are explicit
- the default client bootstrap goes through `getClient()` and `process.env.DATABASE_URL`
- `select`, `first`, `pluck`, or explicit `returning` narrow rows when appropriate
- `update` and `delete` stay guarded by `where`, and multi-step writes use `transaction(...)` when atomicity matters
- shared query helpers or package changes keep runtime and type coverage aligned

## Read Next

- [PG Testing Guide](./pg-testing.md)
- [PG Table Types Guide](./pg-table-types.md)
- [@faasjs/pg package reference](../references/packages/pg/README.md)
- [QueryBuilder](../references/packages/pg/classes/QueryBuilder.md)
- [Client](../references/packages/pg/classes/Client.md)
- [getClient](../references/packages/pg/functions/getClient.md)
- [createClient](../references/packages/pg/functions/createClient.md)
- [rawSql](../references/packages/pg/functions/rawSql.md)
- [escapeIdentifier](../references/packages/pg/functions/escapeIdentifier.md)
