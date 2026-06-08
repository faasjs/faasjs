[@faasjs/node-utils](../README.md) / parseSchemaValue

# Function: parseSchemaValue()

> **parseSchemaValue**\<`TSchema`, `TFallback`\>(`options`): `Promise`\<[`SchemaOutput`](../type-aliases/SchemaOutput.md)\<`TSchema`, `TFallback`\>\>

Parse a value with an optional Zod schema.

If `schema` is omitted, `defaultValue` is returned and `value` is ignored. If
`value` is `null` or `undefined`, `defaultValue` is passed to
`schema.safeParseAsync()`. When `defaultValue` is omitted, an empty object is
used. Validation failures are formatted with [formatSchemaError](formatSchemaError.md).

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> \| `undefined` = `undefined`

Zod schema type used for parsing.

### TFallback

`TFallback` = `Record`\<`string`, `never`\>

Fallback type used when no schema is provided.

## Parameters

### options

[`ParseSchemaValueOptions`](../type-aliases/ParseSchemaValueOptions.md)\<`TSchema`, `TFallback`\>

Parsing options including the optional schema, raw value, and error formatting.

## Returns

`Promise`\<[`SchemaOutput`](../type-aliases/SchemaOutput.md)\<`TSchema`, `TFallback`\>\>

Parsed (and validated) value matching the schema or fallback type.

## Throws

If the schema validation fails, using the provided `createError` factory or a plain `Error`.

## Example

```ts
import { parseSchemaValue } from '@faasjs/node-utils'
import { z } from '@faasjs/utils'

const params = await parseSchemaValue({
  schema: z.object({
    page: z.coerce.number().default(1),
  }),
  value: { page: '2' },
  errorMessage: 'Invalid params',
})
```
