[@faasjs/core](../README.md) / DefineApiData

# Type Alias: DefineApiData\<TSchema, TEvent, TContext, TResult\>

> **DefineApiData**\<`TSchema`, `TEvent`, `TContext`, `TResult`\> = [`InvokeData`](InvokeData.md)\<`TEvent`, `TContext`, `TResult`\> & `object`

## Type Declaration

### knex

> **knex**: `KnexQuery` \| `undefined`

### params

> **params**: `TSchema` *extends* `ZodSchema` ? `output`\<`NonNullable`\<`TSchema`\>\> : `Record`\<`string`, `never`\>

## Type Parameters

### TSchema

`TSchema` *extends* `ZodSchema` \| `undefined` = `undefined`

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`
