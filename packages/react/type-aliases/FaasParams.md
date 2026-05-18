[@faasjs/react](../README.md) / FaasParams

# Type Alias: FaasParams\<T\>

> **FaasParams**\<`T`\> = `T` *extends* `FaasActionPaths` ? `FaasActions`\[`T`\]\[`"Params"`\] : `T` *extends* `string` ? `Record`\<`string`, `unknown`\> : `never`

Infer params type by action path.

## Type Parameters

### T

`T` = `unknown`

Candidate action path type.
