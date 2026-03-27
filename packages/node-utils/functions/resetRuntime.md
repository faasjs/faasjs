[@faasjs/node-utils](../README.md) / resetRuntime

# Function: resetRuntime()

> **resetRuntime**(): `void`

Reset cached runtime and loader state used by this module.

## Returns

`void`

## Example

```ts
import { loadPackage, resetRuntime } from '@faasjs/node-utils'

await loadPackage('./src/hello.func.ts')
resetRuntime()
```
