[@faasjs/pg](../README.md) / escapeIdentifier

# Function: escapeIdentifier()

> **escapeIdentifier**(`identifier`): `string`

Escapes a SQL identifier, preserving trusted [RawSql](../type-aliases/RawSql.md) fragments.

## Parameters

### identifier

`string` \| [`RawSql`](../type-aliases/RawSql.md)

Table name, column name, dotted identifier, or trusted raw fragment.

## Returns

`string`

Escaped identifier string ready to be embedded into SQL text.
