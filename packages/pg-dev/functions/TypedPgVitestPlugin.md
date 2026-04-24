[@faasjs/pg-dev](../README.md) / TypedPgVitestPlugin

# Function: TypedPgVitestPlugin()

> **TypedPgVitestPlugin**(): `Plugin`

Creates the Vitest plugin that wires `@faasjs/pg-dev` into the test runner.

The plugin registers a lazy setup module for each enabled project. The first `await getClient()`
in a test file starts PGlite, runs migrations from `./migrations`, backfills
`process.env.DATABASE_URL`, and later `beforeEach` hooks clear table contents before each test.

By default the plugin skips browser-like projects such as `jsdom` and `happy-dom`.

## Returns

`Plugin`

Vitest/Vite plugin instance.
