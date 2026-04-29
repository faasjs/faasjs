[@faasjs/pg-dev](../README.md) / setupPgVitest

# Function: setupPgVitest()

> **setupPgVitest**(`runtime`): `void`

Wires `@faasjs/pg-dev` into a Vitest setup module without forcing consumers to import package
setup files directly from `node_modules`.

The helper registers a lazy async bootstrap for `await getClient()`. The first default-client
lookup starts PGlite, runs `./migrations`, and backfills `process.env.DATABASE_URL`. Later tests
reuse that database within the current Vitest file while `beforeEach` resets table contents.

## Parameters

### runtime

[`PgVitestSetupRuntime`](../interfaces/PgVitestSetupRuntime.md)

Runtime hooks from the active Vitest project.

## Returns

`void`
