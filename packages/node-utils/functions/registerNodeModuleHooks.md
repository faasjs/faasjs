[@faasjs/node-utils](../README.md) / registerNodeModuleHooks

# Function: registerNodeModuleHooks()

> **registerNodeModuleHooks**(`options?`): `void`

Register Node module hooks for tsconfig path alias resolution.

## Parameters

### options?

[`RegisterNodeModuleHooksOptions`](../type-aliases/RegisterNodeModuleHooksOptions.md) = `{}`

Hook registration options such as entry file, root, and tsconfig path.

## Returns

`void`

## Example

```ts
import { registerNodeModuleHooks } from '@faasjs/node-utils'

registerNodeModuleHooks({
  root: process.cwd(),
})
```
