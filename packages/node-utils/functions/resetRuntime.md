[@faasjs/node-utils](../README.md) / resetRuntime

# Function: resetRuntime()

> **resetRuntime**(): `void`

Clear cached loader state used by this module.

Installed Node module hooks remain active. This only resets the in-memory
root, tsconfig, path-alias, and cache-busting state used by [loadPackage](loadPackage.md)
and [registerNodeModuleHooks](registerNodeModuleHooks.md).

## Returns

`void`

## Example

```ts
import { loadPackage, resetRuntime } from '@faasjs/node-utils'

await loadPackage('./src/hello.api.ts')
resetRuntime()
```
