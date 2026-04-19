[@faasjs/pg](../README.md) / rawSql

# Function: rawSql()

> **rawSql**(`value`): [`RawSql`](../type-aliases/RawSql.md)

Creates a raw SQL value object.

This function is used to mark a string as a raw SQL value, which can be useful
when you need to include raw SQL in a query without any escaping or processing.

## Parameters

### value

`string`

The raw SQL string.

## Returns

[`RawSql`](../type-aliases/RawSql.md)

An object representing the raw SQL value with a custom `toString` method.
