[**@faasjs/pg**](../README.md)

[@faasjs/pg](../README.md) / escapeIdentifier

# Function: escapeIdentifier()

> **escapeIdentifier**(`identifier`): `string`

Escapes a SQL identifier, preserving trusted [RawSql](../type-aliases/RawSql.md) fragments.

Dotted identifiers are escaped segment by segment, `*` and `COUNT(*)` are preserved
for query-builder output, and non-string values throw before SQL is generated.

## Parameters

### identifier

`string` \| [`RawSql`](../type-aliases/RawSql.md)

Table name, column name, dotted identifier, or trusted raw fragment.

## Returns

`string`

Escaped identifier string ready to be embedded into SQL text.
