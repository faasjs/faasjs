# PG Query Builder Guide

When implementing or reviewing `@faasjs/pg` query code, default to the fluent `QueryBuilder` surface instead of handwritten SQL.

## Use This Guide When

- creating or updating `SELECT`, `INSERT`, `UPDATE`, `DELETE`, or `UPSERT` queries
- adding joins, ordering, pagination, aggregates, or JSONB field selection
- deciding whether a query can stay inside the typed fluent API
- reviewing whether a shared query helper still returns the narrowest useful row shape

## Default Workflow

1. Start from `client.query('<table>')`.
2. Keep the query in builder methods for `select`, `where`, `join`, `orderBy`, `limit`, and `offset`.
3. Narrow results with `select(...)`, `first()`, or `pluck(...)` when the caller does not need full rows.
4. Use `whereRaw`, `orWhereRaw`, or `orderByRaw` only for expressions the builder cannot represent directly.
5. Keep write queries guarded with explicit `where` conditions, and keep `returning` columns as narrow as possible.

## Minimal Example

```ts
const rows = await client
  .query('users')
  .select('id', 'name', { column: 'metadata', fields: ['age'] })
  .leftJoin('profiles', 'users.id', 'profiles.user_id')
  .where('name', 'ILIKE', 'a%')
  .orderBy('id', 'ASC')
```

## Rules

### 1. Keep query shape and result shape aligned

- `select(...)`, `first()`, `pluck(...)`, and `returning` define what downstream code can safely assume.
- If you extract a shared query helper, keep the narrowed result shape explicit instead of widening back to full rows.
- When contributing to `@faasjs/pg` itself, update runtime coverage and type coverage together.

### 2. Prefer typed clauses before raw SQL

- Use `where`, `orWhere`, `join`, `leftJoin`, `orderBy`, `count`, `first`, and `pluck` first.
- Prefer built-in operators for equality, ranges, arrays, pattern matching, and JSONB containment.
- Use raw clauses only for expressions such as `CASE`, SQL functions, or predicates that do not map cleanly to the built-in surface.

### 3. Keep raw fragments parameterized

- Runtime values should still go through placeholders and params.
- `rawSql(...)` should be reserved for trusted SQL fragments or identifiers that cannot be represented otherwise.
- Never interpolate end-user values into raw SQL strings.

### 4. Narrow result shapes intentionally

- Use `select(...)` to avoid fetching wider row shapes than needed.
- Use JSONB field selection when the caller only needs part of a JSONB column.
- Use `first()` for a single row, `pluck('<column>')` for a single column, and explicit `returning` columns for write queries.

### 5. Keep write queries guarded

- `update()` and `delete()` should keep explicit `where` conditions.
- Treat an unbounded mutation as a bug unless it is a deliberate migration or maintenance action.
- Do not remove or bypass the package's missing-where protection.

### 6. Use `returning` only when the caller needs changed rows

- `insert`, `update`, and `upsert` return an empty result shape unless `returning` is requested.
- Keep `returning` columns explicit so the result type stays narrow and predictable.
- Prefer the minimum set of returned columns instead of `['*']` unless the caller truly needs the whole row.

## Review Checklist

- builder methods are used before falling back to raw SQL
- the result shape matches what the caller actually reads
- raw fragments still use parameters for runtime values
- `select`, `first`, `pluck`, or explicit `returning` narrow rows when appropriate
- `update` and `delete` stay guarded by `where`
- shared query helpers or package changes keep runtime and type coverage aligned

## Read Next

- [PG Raw SQL and Client Guide](./pg-raw-sql-and-client.md)
- [PG Testing Guide](./pg-testing.md)
- [@faasjs/pg package reference](../references/packages/pg/README.md)
- [QueryBuilder](../references/packages/pg/classes/QueryBuilder.md)
- [Client](../references/packages/pg/classes/Client.md)
- [rawSql](../references/packages/pg/functions/rawSql.md)
