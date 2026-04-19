[@faasjs/pg-dev](../README.md) / TypedPgVitestPlugin

# Function: TypedPgVitestPlugin()

> **TypedPgVitestPlugin**(`options?`): `Plugin`

Creates the Vitest plugin that wires `@faasjs/pg-dev` into the test runner.

The plugin starts worker-isolated temporary databases, runs migrations from `./migrations`,
injects the connection string into `process.env.DATABASE_URL`, and clears table contents before
each test.

By default the plugin skips browser-like projects such as `jsdom` and `happy-dom`. Pass
`environments` or `projects` to opt into a narrower set explicitly.

## Parameters

### options?

[`TypedPgVitestPluginOptions`](../interfaces/TypedPgVitestPluginOptions.md) = `{}`

Optional project filters.

## Returns

`Plugin`

Vitest/Vite plugin instance.
