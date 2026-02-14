[@faasjs/node-utils](../README.md) / loadPackage

# Function: loadPackage()

> **loadPackage**\<`T`\>(`name`, `defaultNames?`): `Promise`\<`T`\>

Asynchronously loads a package by its name, supporting both ESM and CJS runtimes.

## Type Parameters

### T

`T` = `unknown`

The type of module to be loaded.

## Parameters

### name

`string`

The package name to load.

### defaultNames?

`string` | `string`[]

Preferred export keys used to resolve default values.

## Returns

`Promise`\<`T`\>

A promise that resolves to loaded module.

## Throws

If runtime is unknown.

## Example

```ts
const myModule = await loadPackage<MyModuleType>('my-module')
```
