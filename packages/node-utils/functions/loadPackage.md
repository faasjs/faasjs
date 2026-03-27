[@faasjs/node-utils](../README.md) / loadPackage

# Function: loadPackage()

> **loadPackage**\<`T`\>(`name`, `defaultNames?`, `options?`): `Promise`\<`T`\>

Asynchronously loads a package by its name, supporting both ESM and CJS.

## Type Parameters

### T

`T` = `unknown`

The type of module to be loaded.

## Parameters

### name

`string`

The package name to load.

### defaultNames?

`string` \| `string`[]

Preferred export keys used to resolve default values.

### options?

[`LoadPackageOptions`](../type-aliases/LoadPackageOptions.md) = `{}`

Optional runtime loader options.

## Returns

`Promise`\<`T`\>

Loaded module or resolved default export.

## Example

```ts
import { loadPackage } from '@faasjs/node-utils'

const func = await loadPackage('./src/hello.func.ts', ['func', 'default'])
```
