[@faasjs/pg-dev](../README.md) / setupTypedPgVitest

# Function: setupTypedPgVitest()

> **setupTypedPgVitest**(`runtime`): `string`

Wires `@faasjs/pg-dev` into a Vitest setup module without forcing consumers to import package
setup files directly from `node_modules`.

This is primarily used by the plugin's generated setup module so the active project imports
`vitest` locally while reusing the shared database reset logic from `@faasjs/pg-dev`.

## Parameters

### runtime

[`TypedPgVitestSetupRuntime`](../interfaces/TypedPgVitestSetupRuntime.md)

Runtime hooks from the active Vitest project.

## Returns

`string`

Temporary database URL for the current worker.
