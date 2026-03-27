[@faasjs/dev](../README.md) / InvokeData

# Type Alias: InvokeData\<TEvent, TContext, TResult\>

> **InvokeData**\<`TEvent`, `TContext`, `TResult`\> = `object`

Mutable invocation state shared by plugins and the final handler.

## Type Parameters

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### callback

> **callback**: `any`

Optional callback forwarded from the runtime.

### config

> **config**: [`Config`](Config.md)

Resolved function configuration.

### context

> **context**: `TContext`

Runtime context payload.

### event

> **event**: `TEvent`

Runtime event payload.

### handler?

> `optional` **handler?**: [`Handler`](Handler.md)\<`TEvent`, `TContext`, `TResult`\>

Final business handler when one exists.

### logger

> **logger**: `Logger`

Request-scoped logger instance.

### response

> **response**: `any`

Response value produced by plugins or handlers.
