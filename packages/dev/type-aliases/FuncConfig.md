[@faasjs/dev](../README.md) / FuncConfig

# Type Alias: FuncConfig\<TEvent, TContext, TResult\>

> **FuncConfig**\<`TEvent`, `TContext`, `TResult`\> = `object`

Constructor options for [Func](../classes/Func.md).

## Type Parameters

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

## Properties

### handler?

> `optional` **handler?**: [`Handler`](Handler.md)\<`TEvent`, `TContext`, `TResult`\>

Final business handler invoked after plugins complete.

### plugins?

> `optional` **plugins?**: [`Plugin`](Plugin.md)[]

Ordered plugin list to attach before the run handler.
