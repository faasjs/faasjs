[**@faasjs/node-utils**](../README.md)

[@faasjs/node-utils](../README.md) / SchemaOutput

# Type Alias: SchemaOutput\<TSchema, TFallback\>

> **SchemaOutput**\<`TSchema`, `TFallback`> > > > \> = `TSchema` _extends_ `ZodType` ? `ZodOutput`\<`NonNullable`\<`TSchema`>> >> >> >> \>\> : `TFallback`

Parsed value type for an optional Zod schema.

When a schema is present, the type is the schema's output type. When the
schema is omitted, the caller-provided fallback type is used instead because
the raw value is not parsed.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

### TFallback

`TFallback` = `Record`\<`string`, `never`\>
