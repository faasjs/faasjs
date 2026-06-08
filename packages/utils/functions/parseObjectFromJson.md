[@faasjs/utils](../README.md) / parseObjectFromJson

# Function: parseObjectFromJson()

> **parseObjectFromJson**\<`T`\>(`value`): `T`

Normalizes JSON-like input into an object record.

Existing object records are returned as-is. JSON strings are parsed and cast to `T`;
callers should validate untrusted parsed values with a schema when shape matters.

## Type Parameters

### T

`T` _extends_ `Record`\<`string`, `unknown`\>

Expected object record type.

## Parameters

### value

`unknown`

Existing object or JSON string payload.

## Returns

`T`

Existing object record or parsed JSON value cast to `T`.
