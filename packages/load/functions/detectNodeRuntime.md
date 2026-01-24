[@faasjs/load](../README.md) / detectNodeRuntime

# Function: detectNodeRuntime()

> **detectNodeRuntime**(): [`NodeRuntime`](../type-aliases/NodeRuntime.md)

Detect current JavaScript runtime environment.

This function checks for presence of `import.meta` and `require` to determine
whether runtime is using ECMAScript modules (ESM) or CommonJS modules (CJS).

## Returns

[`NodeRuntime`](../type-aliases/NodeRuntime.md)

- Returns 'module' if runtime is using ECMAScript modules,
                           and 'cjs' if the runtime is using CommonJS modules.

## Throws

- Throws an error if runtime cannot be determined.
