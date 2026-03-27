[@faasjs/node-utils](../README.md) / ExportedHandler

# Type Alias: ExportedHandler\<TEvent, TContext, TResult\>

> **ExportedHandler**\<`TEvent`, `TContext`, `TResult`\> = (`event?`, `context?`, `callback?`) => `Promise`\<`TResult`\>

Runtime-compatible handler signature exported by packaged FaasJS functions.

## Type Parameters

### TEvent

`TEvent` = `any`

Runtime event type.

### TContext

`TContext` = `any`

Runtime context type.

### TResult

`TResult` = `any`

Async result type returned by the handler.

## Parameters

### event?

`TEvent`

### context?

`TContext`

### callback?

(...`args`) => `any`

## Returns

`Promise`\<`TResult`\>
