[@faasjs/core](../README.md) / ExportedHandler

# Type Alias: ExportedHandler\<TEvent, TContext, TResult\>

> **ExportedHandler**\<`TEvent`, `TContext`, `TResult`\> = (`event?`, `context?`, `callback?`) => `Promise`\<`TResult`\>

Runtime-compatible handler returned by [Func.export](../classes/Func.md#export).

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

Runtime event payload.

### context?

`TContext`

Runtime context object.

### callback?

(...`args`) => `any`

Optional callback supplied by callback-based runtimes.

## Returns

`Promise`\<`TResult`\>

Final function response.
