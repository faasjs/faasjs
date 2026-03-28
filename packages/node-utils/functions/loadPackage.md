[@faasjs/node-utils](../README.md) / loadPackage

# Function: loadPackage()

> **loadPackage**\<`T`\>(`name`, `defaultNames?`, `options?`): `Promise`\<`T`\>

Load a module in the current Node runtime and optionally resolve a preferred export key.

In ESM mode, the loader can install tsconfig-aware hooks and append a version query string to bust
Node's import cache for project-local files.

## Type Parameters

### T

`T` = `unknown`

The type of module to be loaded.

## Parameters

### name

`string`

Package name, file path, or module specifier to load.

### defaultNames?

`string` \| `string`[]

Preferred export key or keys to resolve before falling back to the full module object.

### options?

[`LoadPackageOptions`](../type-aliases/LoadPackageOptions.md) = `{}`

Optional loader overrides such as project root, tsconfig path, or cache-busting version.

## Returns

`Promise`\<`T`\>

Loaded export value or the full module namespace when no preferred key exists.

## Throws

If the runtime cannot be detected or the requested module fails to load.

## Example

```ts
import { loadPackage } from '@faasjs/node-utils'

const func = await loadPackage('./src/hello.func.ts', ['func', 'default'])
```
