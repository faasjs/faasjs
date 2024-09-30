[@faasjs/react](../README.md) / FaasData

# Type Alias: FaasData\<T\>

> **FaasData**\<`T`\>: `T` *extends* `FaasActionPaths` ? `FaasActions`\[`T`\]\[`"Data"`\] : `T` *extends* `ReactServerAction` ? `Awaited`\<`ReturnType`\<`T`\>\> : `T`

Get the returning data type of the action.

## Type Parameters

• **T** = `any`
