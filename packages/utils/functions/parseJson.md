[**@faasjs/utils**](../README.md)

[@faasjs/utils](../README.md) / parseJson

# Function: parseJson()

## Call Signature

> **parseJson**\<`T`>>>>\>(`value`): `T`

Parses a JSON string into a JavaScript value.

### Type Parameters

#### T

`T` = `unknown`

Expected parsed value type. Without a schema, this is a TypeScript assertion.

### Parameters

#### value

`unknown`

The JSON string to parse.

### Returns

`T`

The parsed JavaScript value.

### Throws

If the input is not a string.

### Throws

If the string is not valid JSON.

## Call Signature

> **parseJson**\<`Schema`>>>>\>(`value`, `schema`): `output`\<`Schema`>>>>\>

Parses a JSON string and validates the parsed value with a Zod schema.

### Type Parameters

#### Schema

`Schema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

Zod schema used to validate and type the parsed value.

### Parameters

#### value

`unknown`

The JSON string to parse.

#### schema

`Schema`

Zod schema used to validate the parsed value.

### Returns

`output`\<`Schema`\>

The Zod schema output.

### Throws

If the input is not a string.

### Throws

If the string is not valid JSON.

### Throws

If schema validation fails.
