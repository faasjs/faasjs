[@faasjs/node-utils](../README.md) / ParseSchemaValueOptions

# Type Alias: ParseSchemaValueOptions\<TSchema, TFallback\>

> **ParseSchemaValueOptions**\<`TSchema`, `TFallback`\> = `object`

Options for parsing an unknown value with an optional Zod schema.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

Zod schema used when present.

### TFallback

`TFallback` = `Record`\<`string`, `never`\>

Value and output type used when the schema is omitted.

## Properties

### createError?

> `optional` **createError?**: (`message`) => `Error`

Optional factory for wrapping the formatted validation message.

#### Parameters

##### message

`string`

#### Returns

`Error`

### defaultValue?

> `optional` **defaultValue?**: `TFallback`

Value returned without a schema and parsed when the raw value is nullish.

Defaults to an empty object.

### errorMessage

> **errorMessage**: `string`

First line for formatted validation failures.

### schema?

> `optional` **schema?**: `TSchema`

Optional Zod schema used to parse the value.

### value

> **value**: `unknown`

Raw value to parse.
