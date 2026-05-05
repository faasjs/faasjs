[@faasjs/core](../README.md) / Handler

# Type Alias: Handler\<TEvent, TContext, TResult\>

> **Handler**\<`TEvent`, `TContext`, `TResult`\> = (`data`) => `Promise`\<`TResult`\>

User-defined handler executed after plugins have prepared invoke data.

## Type Parameters

### TEvent

`TEvent` = `unknown`

Runtime event type.

### TContext

`TContext` = `unknown`

Runtime context type.

### TResult

`TResult` = `unknown`

Async result type returned by the handler.

## Parameters

### data

[`InvokeData`](InvokeData.md)\<`TEvent`, `TContext`\>

Invocation data exposed to the handler.

## Returns

`Promise`\<`TResult`\>

Handler result that becomes the function response.
