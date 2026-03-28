[@faasjs/node-utils](../README.md) / detectNodeRuntime

# Function: detectNodeRuntime()

> **detectNodeRuntime**(): [`NodeRuntime`](../type-aliases/NodeRuntime.md)

Detect whether the current Node process should load modules through CommonJS or ESM.

The detected runtime is cached until [resetRuntime](resetRuntime.md) is called.

## Returns

[`NodeRuntime`](../type-aliases/NodeRuntime.md)

`'module'` for ESM and `'commonjs'` for CommonJS.

## Throws

If the runtime cannot be determined from the current global environment.

## Example

```ts
import { detectNodeRuntime } from '@faasjs/node-utils'

const runtime = detectNodeRuntime()
```
