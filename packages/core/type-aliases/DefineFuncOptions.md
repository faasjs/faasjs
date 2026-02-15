[@faasjs/core](../README.md) / DefineFuncOptions

# Type Alias: DefineFuncOptions\<TSchema, TEvent, TContext, TResult\>

> **DefineFuncOptions**\<`TSchema`, `TEvent`, `TContext`, `TResult`\> = `object`

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

[`DefineFuncData`](DefineFuncData.md)\<`TSchema`, `TEvent`, `TContext`, `TResult`\>

#### Returns

`Promise`\<`TResult`\>

### schema?

> `optional` **schema**: `TSchema`
