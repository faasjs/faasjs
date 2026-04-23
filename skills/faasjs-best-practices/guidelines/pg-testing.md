# PG Testing Guide

When changing `@faasjs/pg`-backed code, every behavior change should come with runtime tests, and type-sensitive surface changes should come with `expectTypeOf(...)` coverage.

## Use This Guide When

- adding or changing query-builder usage in app code
- changing shared query helpers, repository wrappers, or table typing
- updating schema or migration helpers
- writing integration tests for `@faasjs/pg` or `@faasjs/pg-dev`

## Default Workflow

1. Prefer `TypedPgVitestPlugin()` so Vitest registers a lazy temporary database bootstrap, starts PGlite on the first `await getClient()`, runs migrations, backfills `DATABASE_URL`, and clears table contents before later tests in the same file. In mixed workspaces, remember it skips `jsdom` and `happy-dom` projects unless you opt in with `environments` or `projects`.
2. Use `await getClient()` to seed data and run assertions so app code and tests share the same async bootstrap path.
3. Add only the suite-specific setup or fixtures that the plugin does not already provide.
4. Pair runtime assertions with `expectTypeOf(...)` when query inference, declaration merging, or shared wrappers affect types.
5. Run the smallest validation command that matches the change surface.

Mixed-workspace example:

```ts
import { TypedPgVitestPlugin } from '@faasjs/pg-dev'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: [TypedPgVitestPlugin({ projects: ['node'] })],
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
import { TypedPgVitestPlugin } from '@faasjs/pg-dev'

export default defineConfig({
  plugins: [TypedPgVitestPlugin()],
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

- Prefer `TypedPgVitestPlugin()` to reset rows automatically before each test.
- Create extra tables, seed data, or temp folders explicitly when a suite goes beyond the default migrations.
- Do not rely on hidden state from another test file or case.

### 5. Use `@faasjs/pg-dev` through the Vitest plugin

- Prefer `TypedPgVitestPlugin()` for workspace test runs.
- In mixed Vitest workspaces, pass `environments` or `projects` when `jsdom` or `happy-dom` suites should participate.
- PG-backed runtime tests are still Node runtime tests. Prefer the regular `node` project, but if only that subset needs project-level setup, use a node-scoped project name such as `node-pg` instead of a standalone runtime bucket like `pg`.
- In tests, let the plugin lazy-bootstrap the default client through `await getClient()`. If a suite also reads `process.env.DATABASE_URL` directly, trigger the bootstrap with `await getClient()` first.
- Reach for `createClient(process.env.DATABASE_URL, options)` only when a suite genuinely needs custom `postgres.js` options or an extra connection after the bootstrap URL exists.
- Keep lower-level database bootstrapping internal to the test support layer; public examples should only show the plugin.

## Review Checklist

- runtime behavior changes have test coverage
- type-sensitive changes have `expectTypeOf(...)` coverage
- tests live close to the feature area that changed
- mixed workspaces configure the plugin scope explicitly when browser-like projects need it
- pg-backed runtime tests stay in a node-scoped project (`node` or `node-pg`) in mixed workspaces
- suites either rely on the plugin reset or clean up their own extra setup
- validation commands match the change surface

## Read Next

- [PG Query Builder Guide](./pg-query-builder.md)
- [PG Schema and Migrations Guide](./pg-schema-and-migrations.md)
- [@faasjs/pg-dev package reference](../references/packages/pg-dev/README.md)
- [TypedPgVitestPlugin](../references/packages/pg-dev/functions/TypedPgVitestPlugin.md)
- [setupTypedPgVitest](../references/packages/pg-dev/functions/setupTypedPgVitest.md)
- [getClient](../references/packages/pg/functions/getClient.md)
