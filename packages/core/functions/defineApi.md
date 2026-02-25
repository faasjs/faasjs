[@faasjs/core](../README.md) / defineApi

# Function: defineApi()

> **defineApi**\<`TSchema`, `TEvent`, `TContext`, `TResult`\>(`options`): [`Func`](../classes/Func.md)\<`DefineApiEvent`\<`TSchema`, `TEvent`\>, `TContext`, `TResult`\>

Create an HTTP API function with optional Zod validation.

Plugins are always auto-loaded from `func.config.plugins`.
Plugin module exports must be either a named class (normalized from
plugin type) or a default class export.

The `http` plugin is required.

## Type Parameters

### TSchema

`TSchema` *extends* `ZodSchema` \| `undefined` = `undefined`

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

## Parameters

### options

[`DefineApiOptions`](../type-aliases/DefineApiOptions.md)\<`TSchema`, `TEvent`, `TContext`, `TResult`\>

## Returns

[`Func`](../classes/Func.md)\<`DefineApiEvent`\<`TSchema`, `TEvent`\>, `TContext`, `TResult`\>
