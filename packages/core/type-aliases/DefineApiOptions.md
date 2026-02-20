[@faasjs/core](../README.md) / DefineApiOptions

# Type Alias: DefineApiOptions\<TSchema, TEvent, TContext, TResult\>

> **DefineApiOptions**\<`TSchema`, `TEvent`, `TContext`, `TResult`\> = `object`

## Type Parameters

### TSchema

`TSchema` *extends* `ZodSchema` \| `undefined` = `undefined`

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

## Properties

### handler()

> **handler**: (`data`) => `Promise`\<`TResult`\>

#### Parameters

##### data

[`DefineApiData`](DefineApiData.md)\<`TSchema`, `TEvent`, `TContext`, `TResult`\>

#### Returns

`Promise`\<`TResult`\>

### schema?

> `optional` **schema**: `TSchema`
