[@faasjs/core](../README.md) / defineFunc

# Function: defineFunc()

> **defineFunc**\<`TSchema`, `TEvent`, `TContext`, `TResult`\>(`options`): `Func`\<`TEvent`, `TContext`, `TResult`\>

Create a cloud function with optional Zod validation.

Plugins are always auto-loaded from `func.config.plugins`.
Plugin module exports must be either a named class (normalized from
plugin type) or a default class export.

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

[`DefineFuncOptions`](../type-aliases/DefineFuncOptions.md)\<`TSchema`, `TEvent`, `TContext`, `TResult`\>

## Returns

`Func`\<`TEvent`, `TContext`, `TResult`\>
