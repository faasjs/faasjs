[@faasjs/func](../README.md) / InvokeData

# Type Alias: InvokeData\<TEvent, TContext, TResult\>

> **InvokeData**\<`TEvent`, `TContext`, `TResult`\>: `object`

## Type Parameters

• **TEvent** = `any`

• **TContext** = `any`

• **TResult** = `any`

## Index Signature

 \[`key`: `string`\]: `any`

## Type declaration

### callback

> **callback**: `any`

### config

> **config**: [`Config`](Config.md)

### context

> **context**: `TContext`

### event

> **event**: `TEvent`

### handler?

> `optional` **handler**: [`Handler`](Handler.md)\<`TEvent`, `TContext`, `TResult`\>

### logger

> **logger**: `Logger`

### response

> **response**: `any`
