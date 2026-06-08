[@faasjs/pg-dev](../README.md) / PgVitestPlugin

# Function: PgVitestPlugin()

> **PgVitestPlugin**(): `Plugin`

Creates the Vitest plugin that wires `@faasjs/pg-dev` into the test runner.

The plugin prepends a generated setup module for each enabled Vitest project. That setup
module registers a lazy database bootstrap instead of starting PGlite during config load:
the first default `await getClient()` in a test file starts PGlite, runs migrations from
`./src/db/migrations`, backfills `process.env.DATABASE_URL`, and creates the cached
`@faasjs/pg` client. Later `beforeEach` hooks close cached clients and clear table contents
before each test while preserving the migrations tracking table.

By default the plugin skips browser-like projects such as `jsdom` and `happy-dom`. Existing
`setupFiles` are preserved and the generated setup module is deduplicated if Vitest config
hooks run more than once.

## Returns

`Plugin`

Vitest/Vite plugin instance.
