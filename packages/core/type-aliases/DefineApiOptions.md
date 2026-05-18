[@faasjs/core](../README.md) / DefineApiOptions

# Type Alias: DefineApiOptions\<TSchema, TEvent, TContext, TResult\>

> **DefineApiOptions**\<`TSchema`, `TEvent`, `TContext`, `TResult`\> = `object`

Options for creating a typed API function with [defineApi](../functions/defineApi.md).

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

Zod schema used to validate `event.params`.

### TEvent

`TEvent` = `Record`\<`string`, `unknown`\>

Raw event type passed to the function.

### TContext

`TContext` = `unknown`

Runtime context type.

### TResult

`TResult` = `unknown`

Handler return type.

## Properties

### handler

> **handler**: (`data`) => `Promise`\<`TResult`\>

Async business handler executed after plugin and schema setup.

#### Parameters

##### data

[`DefineApiData`](DefineApiData.md)\<`TSchema`, `TEvent`, `TContext`, `TResult`\>

#### Returns

`Promise`\<`TResult`\>

### schema?

> `optional` **schema?**: `TSchema`

Optional Zod schema used to validate `event.params`.
