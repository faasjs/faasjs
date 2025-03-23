[@faasjs/types](../README.md) / FaasParams

# Type Alias: FaasParams\<T\>

> **FaasParams**\<`T`\> = `T` *extends* [`FaasActionPaths`](FaasActionPaths.md) ? `FaasActions`\[`T`\]\[`"Params"`\] : `T` *extends* [`ReactServerAction`](ReactServerAction.md) ? `Parameters`\<`T`\>\[`0`\] : `Record`\<`string`, `any`\>

Infer the parameters type.

## Type Parameters

### T

`T` = `any`
