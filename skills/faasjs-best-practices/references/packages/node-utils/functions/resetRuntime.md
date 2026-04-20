[@faasjs/node-utils](../README.md) / resetRuntime

# Function: resetRuntime()

> **resetRuntime**(): `void`

Clear cached runtime detection and loader state used by this module.

Installed Node module hooks remain active. This only resets in-memory state used by
[detectNodeRuntime](detectNodeRuntime.md) and [loadPackage](loadPackage.md).

## Returns

`void`

## Example

```ts
import { loadPackage, resetRuntime } from '@faasjs/node-utils'

await loadPackage('./src/hello.api.ts')
resetRuntime()
```
