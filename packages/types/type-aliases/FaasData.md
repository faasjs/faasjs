[@faasjs/types](../README.md) / FaasData

# Type Alias: FaasData\<T\>

> **FaasData**\<`T`\> = `T` *extends* [`FaasActionPaths`](FaasActionPaths.md) ? `FaasActions`\[`T`\]\[`"Data"`\] : `T` *extends* `string` ? `Record`\<`string`, `unknown`\> : `never`

Infer response data type by action path.

If `T` is already a plain object type, it is returned directly.

## Type Parameters

### T

`T` = `unknown`

Candidate action path or response data type.
