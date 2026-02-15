[@faasjs/node-utils](../README.md) / loadPackage

# Function: loadPackage()

> **loadPackage**\<`T`\>(`name`, `defaultNames?`): `Promise`\<`T`\>

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

Preferred export keys used to resolve default values.

`string` | `string`[]

## Returns

`Promise`\<`T`\>

Loaded module or resolved default export.
