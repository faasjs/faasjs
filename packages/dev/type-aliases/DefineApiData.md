[@faasjs/dev](../README.md) / DefineApiData

# Type Alias: DefineApiData\<TSchema\>

> **DefineApiData**\<`TSchema`\> = [`InvokeData`](InvokeData.md)\<`Record`\<`string`, `unknown`\>, `unknown`, `unknown`\> & `object` & [`DefineApiInject`](../interfaces/DefineApiInject.md)

Handler data passed to [defineApi](../functions/defineApi.md).

Extends the normal invoke data with validated `params`, `cookie`, `session`,
and any plugin-provided fields declared through `DefineApiInject`.

## Type Declaration

### cookie

> **cookie**: [`Cookie`](../classes/Cookie.md)

Cookie helper injected by the HTTP plugin.

### params

> **params**: `SchemaOutput`\<`TSchema`, `Record`\<`string`, `never`\>\>

Params validated by the optional Zod schema.

### session

> **session**: [`Session`](../classes/Session.md)

Session helper injected by the HTTP plugin.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

Zod schema used to validate `event.params`.
