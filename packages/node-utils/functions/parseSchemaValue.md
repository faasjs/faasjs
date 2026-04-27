[@faasjs/node-utils](../README.md) / parseSchemaValue

# Function: parseSchemaValue()

> **parseSchemaValue**\<`TSchema`, `TFallback`\>(`options`): `Promise`\<[`SchemaOutput`](../type-aliases/SchemaOutput.md)\<`TSchema`, `TFallback`\>\>

Parse a value with an optional Zod schema.

If `schema` is omitted, `defaultValue` is returned. If `value` is `null` or
`undefined`, the same `defaultValue` is passed to the schema parser. When
`defaultValue` is omitted, an empty object is used.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> \| `undefined` = `undefined`

### TFallback

`TFallback` = `Record`\<`string`, `never`\>

## Parameters

### options

[`ParseSchemaValueOptions`](../type-aliases/ParseSchemaValueOptions.md)\<`TSchema`, `TFallback`\>

## Returns

`Promise`\<[`SchemaOutput`](../type-aliases/SchemaOutput.md)\<`TSchema`, `TFallback`\>\>
