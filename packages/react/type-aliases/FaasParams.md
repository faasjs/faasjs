[@faasjs/react](../README.md) / FaasParams

# Type Alias: FaasParams\<T\>

> **FaasParams**\<`T`\>: `T` *extends* `FaasActionPaths` ? `FaasActions`\[`T`\]\[`"Params"`\] : `T` *extends* `ReactServerAction` ? `Parameters`\<`T`\>\[`0`\] : `T`

Get the parameters type of the action.

## Type Parameters

• **T** = `any`
