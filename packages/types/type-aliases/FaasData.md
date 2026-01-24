[@faasjs/types](../README.md) / FaasData

# Type Alias: FaasData\<T\>

> **FaasData**\<`T`\> = `T` *extends* [`FaasActionPaths`](FaasActionPaths.md) ? `FaasActions`\[`T`\]\[`"Data"`\] : `T` *extends* `Record`\<`string`, `any`\> ? `T` : `Record`\<`string`, `any`\>

Infer the returning data type.

## Type Parameters

### T

`T` = `any`
