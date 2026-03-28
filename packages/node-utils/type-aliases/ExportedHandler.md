[@faasjs/node-utils](../README.md) / ExportedHandler

# Type Alias: ExportedHandler\<TEvent, TContext, TResult\>

> **ExportedHandler**\<`TEvent`, `TContext`, `TResult`\> = (`event?`, `context?`, `callback?`) => `Promise`\<`TResult`\>

Promise-based handler signature exported by packaged FaasJS function modules.

The optional callback keeps compatibility with runtimes that still expose a Node-style completion API.

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

Runtime event payload passed to the handler.

### context?

`TContext`

Runtime context object passed to the handler.

### callback?

(...`args`) => `any`

Optional callback supplied by callback-based runtimes.

## Returns

`Promise`\<`TResult`\>

Promise that resolves to the handler result.
