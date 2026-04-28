[@faasjs/node-utils](../README.md) / loadPackage

# Function: loadPackage()

> **loadPackage**\<`T`\>(`name`): `Promise`\<`T`\>

Load a module in the current Node ESM runtime and return its default export.

The loader can install tsconfig-aware hooks and append a version query string to bust Node's
import cache for project-local files.

## Type Parameters

### T

`T` = `unknown`

The type of module to be loaded.

## Parameters

### name

`string`

Package name, file path, or module specifier to load.

## Returns

`Promise`\<`T`\>

Loaded default export value.

## Throws

If the requested module fails to load or the default export is missing.

## Example

```ts
import { loadPackage } from '@faasjs/node-utils'

const api = await loadPackage('./src/hello.api.ts')
```
