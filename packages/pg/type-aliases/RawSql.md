[**@faasjs/pg**](../README.md)

[@faasjs/pg](../README.md) / RawSql

# Type Alias: RawSql

> **RawSql** = `string` & `object`

Trusted SQL fragment marker used to bypass identifier or value escaping.

Values of this type are produced by [rawSql](../functions/rawSql.md). Treat them as already-safe
SQL text; the library will embed them without quoting or parameter binding.

## Type Declaration

### \_\_raw

> **\_\_raw**: `true`
