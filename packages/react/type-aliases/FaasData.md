[@faasjs/react](../README.md) / FaasData

# Type Alias: FaasData\<T\>

> **FaasData**\<`T`\> = `T` *extends* `FaasActionPaths` ? `FaasActions`\[`T`\]\[`"Data"`\] : `T` *extends* `Record`\<`string`, `any`\> ? `T` : `Record`\<`string`, `any`\>

Infer the returning data type.

## Type Parameters

### T

`T` = `any`
