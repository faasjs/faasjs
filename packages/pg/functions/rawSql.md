[@faasjs/pg](../README.md) / rawSql

# Function: rawSql()

> **rawSql**(`value`): [`RawSql`](../type-aliases/RawSql.md)

Creates a raw SQL value object.

Use this for trusted SQL fragments such as function calls, expressions, or join
operands that should not be quoted as identifiers or serialized as values. Never
wrap user input with `rawSql`; use query parameters instead.

## Parameters

### value

`string`

The raw SQL string.

## Returns

[`RawSql`](../type-aliases/RawSql.md)

An object representing the raw SQL value with a custom `toString` method.
