[@faasjs/utils](../README.md) / parseJson

# Function: parseJson()

> **parseJson**\<`T`\>(`value`): `T`

Parses a JSON string into a JavaScript value.

## Type Parameters

### T

`T` _extends_ `unknown`

Expected parsed value type. The helper does not validate the parsed shape.

## Parameters

### value

`unknown`

The JSON string to parse.

## Returns

`T`

The parsed JavaScript value.

## Throws

If the input is not a string.

## Throws

If the string is not valid JSON.
