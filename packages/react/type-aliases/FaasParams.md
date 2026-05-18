[@faasjs/react](../README.md) / FaasParams

# Type Alias: FaasParams\<T\>

> **FaasParams**\<`T`\> = `T` _extends_ `FaasActionPaths` ? `FaasActions`\[`T`\]\[`"Params"`\] : `T` _extends_ `string` ? `Record`\<`string`, `unknown`\> : `never`

Infer params type by action path.

## Type Parameters

### T

`T` = `unknown`

Candidate action path type.
