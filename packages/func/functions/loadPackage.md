[@faasjs/func](../README.md) / loadPackage

# Function: loadPackage()

> **loadPackage**\<`T`\>(`name`): `Promise`\<`T`\>

Load a package dynamically based on the Node.js runtime environment.

This function detects the current Node.js runtime (either 'module' or 'commonjs') and loads the specified package accordingly.

## Type Parameters

• **T** = `unknown`

The type of the module to be loaded.

## Parameters

### name

`string`

The name of the package to load.

## Returns

`Promise`\<`T`\>

A promise that resolves to the loaded package.

## Throws

If the runtime is neither 'module' nor 'commonjs'.
