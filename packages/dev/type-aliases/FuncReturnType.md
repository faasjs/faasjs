[@faasjs/dev](../README.md) / FuncReturnType

# Type Alias: FuncReturnType\<T\>

> **FuncReturnType**\<`T`\> = `T` *extends* [`Func`](../classes/Func.md)\<`any`, `any`, infer R\> ? `R` : `unknown`

Get the return type of a func.

## Type Parameters

### T

`T` *extends* [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

Func instance whose return type should be extracted.
