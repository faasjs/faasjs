[@faasjs/react](../README.md) / FaasParams

# Type Alias: FaasParams\<T\>

> **FaasParams**\<`T`\> = `T` *extends* `FaasActionPaths` ? `FaasActions`\[`T`\]\[`"Params"`\] : `T` *extends* `ReactServerAction` ? `Parameters`\<`T`\>\[`0`\] : `Record`\<`string`, `any`\>

Infer the parameters type.

## Type Parameters

### T

`T` = `any`
