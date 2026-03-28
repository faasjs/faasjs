[@faasjs/node-utils](../README.md) / registerNodeModuleHooks

# Function: registerNodeModuleHooks()

> **registerNodeModuleHooks**(`options?`): `void`

Install Node module hooks for tsconfig path aliases and TypeScript-friendly local imports.

Calling this function multiple times is safe. Hooks are installed once, while loader state is refreshed
from the latest options when a root, entry, or tsconfig path can be inferred.

## Parameters

### options?

[`RegisterNodeModuleHooksOptions`](../type-aliases/RegisterNodeModuleHooksOptions.md) = `{}`

Hook registration options such as entry file, root, tsconfig path, and cache-busting version.

## Returns

`void`

## Example

```ts
import { registerNodeModuleHooks } from '@faasjs/node-utils'

registerNodeModuleHooks({
  root: process.cwd(),
})
```
