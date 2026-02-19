[@faasjs/core](../README.md) / DefineApiData

# Type Alias: DefineApiData\<TSchema, TEvent, TContext, TResult\>

> **DefineApiData**\<`TSchema`, `TEvent`, `TContext`, `TResult`\> = `InvokeData`\<`TEvent`, `TContext`, `TResult`\> & `object`

## Type Declaration

### knex

> **knex**: `KnexQuery` \| `undefined`

### params

> **params**: `TSchema` _extends_ `ZodSchema` ? `output`\<`NonNullable`\<`TSchema`\>\> : `Record`\<`string`, `never`\>

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodSchema` \| `undefined` = `undefined`

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`
