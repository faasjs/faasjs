[@faasjs/react](../README.md) / FaasData

# Type Alias: FaasData\<T\>

> **FaasData**\<`T`\> = `T` _extends_ `FaasActionPaths` ? `FaasActions`\[`T`\]\[`"Data"`\] : `T` _extends_ `string` ? `Record`\<`string`, `unknown`\> : `never`

Infer response data type by action path.

If `T` is already a plain object type, it is returned directly.

## Type Parameters

### T

`T` = `unknown`

Candidate action path or response data type.
