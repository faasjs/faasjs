[@faasjs/node-utils](../README.md) / loadPackage

# Function: loadPackage()

> **loadPackage**\<`T`\>(`name`, `defaultName?`, `options?`): `Promise`\<`T`\>

Load a module in the current Node ESM runtime and resolve a preferred export key.

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

### defaultName?

`string` = `'default'`

Export key to resolve.

### options?

[`LoadPackageOptions`](../type-aliases/LoadPackageOptions.md) = `{}`

Optional loader overrides such as project root, tsconfig path, or cache-busting version.

## Returns

`Promise`\<`T`\>

Loaded export value.

## Default

```ts
'default'
```

## Default

```ts
{
}
```

## Throws

If the runtime cannot be detected, the requested module fails to load, or the requested export is missing.

## Example

```ts
import { loadPackage } from '@faasjs/node-utils'

const api = await loadPackage('./src/hello.api.ts')
```
