[@faasjs/load](../README.md) / loadPackage

# Function: loadPackage()

> **loadPackage**\<`T`\>(`name`, `defaultNames?`): `Promise`\<`T`\>

Asynchronously loads a package by its name, supporting both ESM and CommonJS runtimes.

## Type Parameters

### T

`T` = `unknown`

The type of module to be loaded.

## Parameters

### name

`string`

The name of package to load.

### defaultNames?

`string` | `string`[]

## Returns

`Promise`\<`T`\>

A promise that resolves to loaded module.

## Throws

If runtime is unknown.

## Example

```typescript
const myModule = await loadPackage<MyModuleType>('my-module');
```
