[@faasjs/pg](../README.md) / escapeValue

# Function: escapeValue()

> **escapeValue**(`value`): `string`

Escapes a literal value for inline SQL generation.

Prefer bound parameters for runtime values whenever possible.

## Parameters

### value

`any`

Value to serialize into SQL text.

## Returns

`string`

SQL literal representation of the value.
