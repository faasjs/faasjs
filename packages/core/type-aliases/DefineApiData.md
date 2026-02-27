[@faasjs/core](../README.md) / DefineApiData

# Type Alias: DefineApiData\<TSchema, TEvent, TContext, TResult\>

> **DefineApiData**\<`TSchema`, `TEvent`, `TContext`, `TResult`\> = [`InvokeData`](InvokeData.md)\<`TEvent`, `TContext`, `TResult`\> & `object` & `DefineApiInject`

## Type Declaration

### cookie

> **cookie**: [`Cookie`](../classes/Cookie.md)

### knex

> **knex**: [`Knex`](../classes/Knex.md) \| `undefined`

### params

> **params**: `TSchema` *extends* `ZodType` ? `output`\<`NonNullable`\<`TSchema`\>\> : `Record`\<`string`, `never`\>

### session

> **session**: [`Session`](../classes/Session.md)

## Type Parameters

### TSchema

`TSchema` *extends* `ZodType` \| `undefined` = `undefined`

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`
