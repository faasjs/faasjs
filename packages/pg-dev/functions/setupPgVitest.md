[**@faasjs/pg-dev**](../README.md)

[@faasjs/pg-dev](../README.md) / setupPgVitest

# Function: setupPgVitest()

> **setupPgVitest**(`runtime`): `void`

Wires `@faasjs/pg-dev` into a Vitest setup module without forcing consumers to import package
setup files directly from `node_modules`.

The helper registers a lazy async bootstrap for `await getClient()`. The first default-client
lookup starts PGlite, runs `./src/db/migrations`, backfills `process.env.DATABASE_URL`,
and creates the cached `@faasjs/pg` client. If startup or migrations fail, the lazy promise is
cleared so the next lookup can retry.

The registered `beforeEach` hook is intentionally cheap before the database is booted. After
boot, it closes cached `@faasjs/pg` clients, truncates public tables with identity restart and
cascade semantics, and preserves `faasjs_pg_migrations`. The `afterAll` hook closes cached
clients and stops the active PGlite server.

## Parameters

### runtime

[`PgVitestSetupRuntime`](../interfaces/PgVitestSetupRuntime.md)

Runtime hooks from the active Vitest project.

## Returns

`void`
