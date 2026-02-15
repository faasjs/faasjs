[@faasjs/core](../README.md) / DefineFuncData

# Type Alias: DefineFuncData\<TSchema, TEvent, TContext, TResult\>

> **DefineFuncData**\<`TSchema`, `TEvent`, `TContext`, `TResult`\> = `InvokeData`\<`TEvent`, `TContext`, `TResult`\> & `object`

## Type Declaration

### knex

> **knex**: `KnexQuery` \| `undefined`

### params

> **params**: `TSchema` *extends* `ZodSchema` ? `output`\<`NonNullable`\<`TSchema`\>\> : `Record`\<`string`, `never`\> \| `undefined`

## Type Parameters

### TSchema

`TSchema` *extends* `ZodSchema` \| `undefined` = `undefined`

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`
