# PG Testing Guide

Use this guide when writing or reviewing tests that use `@faasjs/pg` or `@faasjs/pg-dev` in FaasJS projects.

## Applicable Scenarios

- Adding or modifying query-builder usage in application code
- Modifying shared query helpers, repository wrappers, or table types
- Updating schema or migration helpers
- Writing integration tests for `@faasjs/pg` or `@faasjs/pg-dev`

## Default Workflow

1. Prefer `PgVitestPlugin()` so Vitest registers a lazy temporary database bootstrap. The first database-using file builds one migrated PGlite snapshot for the test project, every database-using file starts an isolated clone, and later tests in the same file receive cleared tables. The helper also backfills `DATABASE_URL`. In mixed workspaces, keep PG-backed tests in a Node project because the plugin skips `jsdom` and `happy-dom` projects.
2. Use `await getClient()` to seed data and run assertions so app code and tests share the same async bootstrap path.
3. Add only the suite-specific setup or fixtures that the plugin does not already provide.
4. Pair runtime assertions with `expectTypeOf(...)` when query inference, declaration merging, or shared wrappers affect types.
5. Run the smallest validation command that matches the change surface.

Mixed-workspace example:

```ts
import { PgVitestPlugin } from '@faasjs/pg-dev'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: [PgVitestPlugin()],
  test: {
    projects: [
      {
        extends: true as const,
        test: {
          name: 'node',
          include: ['src/**/*.test.ts'],
          exclude: ['src/**/*.types.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true as const,
        test: {
          name: 'ui',
          include: ['src/**/*.test.tsx', 'src/**/*.ui.test.ts'],
          environment: 'jsdom',
        },
      },
    ],
  },
})
```

## Minimal Example

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { PgVitestPlugin } from '@faasjs/pg-dev'

export default defineConfig({
  plugins: [PgVitestPlugin()],
})
```

```ts
import { describe, expect, it } from 'vitest'

import { getClient } from '@faasjs/pg'

async function seedUser() {
  const client = await getClient()

  await client.query('users').insert({
    id: 1,
    name: 'Alice',
  })
}

describe('users query', () => {
  it('selects seeded rows', async () => {
    const client = await getClient()

    await seedUser()

    await expect(client.query('users').where('id', 1)).resolves.toMatchObject([{ name: 'Alice' }])
  })
})
```

## Rules

### 1. Every behavior change needs a test update

- Add a new test or update an existing one for every runtime behavior change.
- Prefer focused tests near the feature or query helper you changed instead of broad catch-all suites.
- Test the database behavior the caller relies on, not private implementation details.

### 2. Type-sensitive changes need `expectTypeOf(...)`

- Add or update type assertions when changing inference, overloads, declaration merging, or shared wrappers.
- If a query-builder method or helper changes result shape, test the inferred result type directly.
- Keep runtime coverage and type coverage aligned when a change affects both.

### 3. Keep tests close to the feature they protect

- Put query tests near the repository or helper layer that owns the query.
- Keep schema or migration tests near the migration utilities or setup they validate.
- Store shared test bootstrap close to Vitest config or other test support code.
- If you contribute to `@faasjs/pg` itself, follow the feature-area test layout already used in the package.

### 4. Keep tests isolated even when the plugin resets data

- Prefer `PgVitestPlugin()` to give each database-using test file an isolated PGlite clone and reset rows automatically before each later test in that file.
- Treat migration-defined schema and seed data as the only shared starting state. Do not depend on rows, sequences, or schema changes created by another test file or test case.
- Create extra tables, seed data, or temp folders explicitly when a suite goes beyond the default migrations.
- Do not rely on hidden state from another test file or case.

### 5. Use `@faasjs/pg-dev` through the Vitest plugin

- Prefer `PgVitestPlugin()` for workspace test runs.
- Let the plugin prepend its run-scoped global setup and generated setup module; existing `globalSetup` and `setupFiles` entries are preserved.
- PG-backed runtime tests are still Node runtime tests. Prefer the regular `node` project, but if only that subset needs project-level setup, use a node-scoped project name such as `node-pg` instead of a standalone runtime bucket like `pg`.
- In tests, let the plugin lazy-bootstrap the default client through `await getClient()`. If a suite also reads `process.env.DATABASE_URL` directly, trigger the bootstrap with `await getClient()` first.
- Expect migrations to run once when the first database is requested, not during Vitest configuration. Watch reruns invalidate the snapshot so changed migrations are applied on the next bootstrap.
- Reach for `createClient(process.env.DATABASE_URL, options)` only when a suite genuinely needs custom `postgres.js` options or an extra connection after the bootstrap URL exists.
- Keep lower-level database bootstrapping internal to the test support layer; public examples should only show the plugin.

## See Also

- Testing Guide — shared testing principles (apply first)
- [PG Query Builder and Raw SQL Guide](./pg-query-builder.md) — building queries under test
- [PG Table Types Guide](./pg-table-types.md) — table type definitions for typed assertions
- [PG Schema and Migrations Guide](./pg-schema-and-migrations.md) — migrations run by the plugin

## Review Checklist

- runtime behavior changes have test coverage
- type-sensitive changes have `expectTypeOf(...)` coverage
- tests live close to the feature area that changed
- mixed workspaces keep PG-backed tests in a Node project because browser-like projects are skipped
- pg-backed runtime tests stay in a node-scoped project (`node` or `node-pg`) in mixed workspaces
- suites rely on per-file database clones and per-test row resets without sharing test-created state
- suites clean up extra tables, seed data, or temp folders beyond the plugin defaults
- validation commands match the change surface
