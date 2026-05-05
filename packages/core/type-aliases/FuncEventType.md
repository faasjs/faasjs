[@faasjs/core](../README.md) / FuncEventType

# Type Alias: FuncEventType\<T\>

> **FuncEventType**\<`T`\> = `T` _extends_ [`Func`](../classes/Func.md)\<infer P, `any`, `any`\> ? `P` : `unknown`

Get the event type of a func.

## Type Parameters

### T

`T` _extends_ [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

Func instance whose event type should be extracted.
