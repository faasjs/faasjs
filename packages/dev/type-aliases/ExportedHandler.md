[@faasjs/dev](../README.md) / ExportedHandler

# Type Alias: ExportedHandler\<TEvent, TContext, TResult\>

> **ExportedHandler**\<`TEvent`, `TContext`, `TResult`\> = (`event?`, `context?`, `callback?`) => `Promise`\<`TResult`\>

Runtime-compatible handler returned by [Func.export](../classes/Func.md#export).

## Type Parameters

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

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
