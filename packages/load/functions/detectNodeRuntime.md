[@faasjs/load](../README.md) / detectNodeRuntime

# Function: detectNodeRuntime()

> **detectNodeRuntime**(): [`NodeRuntime`](../type-aliases/NodeRuntime.md)

Detect the current JavaScript runtime environment.

This function checks for the presence of `import.meta` and `require` to determine
whether the runtime is using ECMAScript modules (ESM) or CommonJS modules (CJS).

## Returns

[`NodeRuntime`](../type-aliases/NodeRuntime.md)

- Returns 'module' if the runtime is using ECMAScript modules,
                           and 'cjs' if the runtime is using CommonJS modules.

## Throws

- Throws an error if the runtime cannot be determined.
