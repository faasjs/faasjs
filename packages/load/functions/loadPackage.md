[@faasjs/load](../README.md) / loadPackage

# Function: loadPackage()

> **loadPackage**\<`T`\>(`name`, `defaultNames`): `Promise`\<`T`\>

Asynchronously loads a package by its name, supporting both ESM and CommonJS runtimes.

Also supports loading TypeScript and TSX files by checking for the presence of the "tsx" package.

## Type Parameters

• **T** = `unknown`

The type of the module to be loaded.

## Parameters

### name

`string`

The name of the package to load.

### defaultNames

`string` | `string`[]

## Returns

`Promise`\<`T`\>

A promise that resolves to the loaded module.

## Throws

If the runtime is unknown.

## Example

```typescript
const myModule = await loadPackage<MyModuleType>('my-module');
```
