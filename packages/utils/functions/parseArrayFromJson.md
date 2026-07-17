[@faasjs/utils](../README.md) / parseArrayFromJson

# Function: parseArrayFromJson()

> **parseArrayFromJson**\<`T`>>>>\>(`value`): `T`

Normalizes JSON-like input into an array.

Existing arrays are returned as-is. JSON strings are parsed and cast to `T`;
callers should validate untrusted parsed values with a schema when shape matters.

## Type Parameters

### T

`T` _extends_ `unknown`[]

Expected array type.

## Parameters

### value

`unknown`

Existing array or JSON string payload.

## Returns

`T`

Existing array or parsed JSON value cast to `T`.
