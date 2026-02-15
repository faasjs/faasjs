[@faasjs/node-utils](../README.md) / detectNodeRuntime

# Function: detectNodeRuntime()

> **detectNodeRuntime**(): [`NodeRuntime`](../type-aliases/NodeRuntime.md)

Detect current JavaScript runtime environment.

This function checks for presence of `require` first, then falls back to
Node.js ESM detection via `process.versions.node`.

## Returns

[`NodeRuntime`](../type-aliases/NodeRuntime.md)

Returns `module` for ESM and `commonjs` for CJS.

## Throws

Throws an error if runtime cannot be determined.
