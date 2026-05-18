[@faasjs/node-utils](../README.md) / SchemaOutput

# Type Alias: SchemaOutput\<TSchema, TFallback\>

> **SchemaOutput**\<`TSchema`, `TFallback`\> = `TSchema` _extends_ `ZodType` ? `output`\<`NonNullable`\<`TSchema`\>\> : `TFallback`

Parsed value type for an optional Zod schema.

When a schema is present, the type is the schema's output type. When the
schema is omitted, the caller-provided fallback type is used instead.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

### TFallback

`TFallback` = `Record`\<`string`, `never`\>
