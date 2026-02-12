[@faasjs/dev](../README.md) / defineFunc

# Function: defineFunc()

> **defineFunc**\<`TEvent`, `TContext`, `TResult`\>(`handler`): [`Func`](../classes/Func.md)\<`TEvent`, `TContext`, `TResult`\>

Create a cloud function from business logic and auto-load plugins from
`func.config.plugins`.

`defineFunc` receives business logic directly (no wrapper function), and
resolves plugin modules during the first mount based on config from
`faas.yaml` (already loaded into `func.config` by `@faasjs/load`,
`@faasjs/server`, or `@faasjs/dev`).

## Type Parameters

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

## Parameters

### handler

[`Handler`](../type-aliases/Handler.md)\<`TEvent`, `TContext`, `TResult`\>

## Returns

[`Func`](../classes/Func.md)\<`TEvent`, `TContext`, `TResult`\>
