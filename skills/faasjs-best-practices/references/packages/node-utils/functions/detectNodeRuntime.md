[@faasjs/node-utils](../README.md) / detectNodeRuntime

# Function: detectNodeRuntime()

> **detectNodeRuntime**(): `"module"`

Detect whether the current Node process is running in the supported ESM runtime.

The detected runtime is cached until [resetRuntime](resetRuntime.md) is called.

## Returns

`"module"`

`'module'` for ESM.

## Throws

If the runtime cannot be determined from the current global environment.

## Example

```ts
import { detectNodeRuntime } from '@faasjs/node-utils'

const runtime = detectNodeRuntime()
```
