[@faasjs/types](../README.md) / FaasParams

# Type Alias: FaasParams\<T\>

> **FaasParams**\<`T`\> = `T` _extends_ [`FaasActionPaths`](FaasActionPaths.md) ? `FaasActions`\[`T`\]\[`"Params"`\] : `Record`\<`string`, `unknown`\>

Infer params type by action path.

## Type Parameters

### T

`T` = `unknown`

Candidate action path type.
