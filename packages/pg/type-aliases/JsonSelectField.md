[@faasjs/pg](../README.md) / JsonSelectField

# Type Alias: JsonSelectField\<T\>

> **JsonSelectField**\<`T`\> = `object`

Select a subset of fields from a JSON or JSONB column.

Used by [QueryBuilder.select](../classes/QueryBuilder.md#select) to emit `jsonb_build_object(...)` for a
typed JSON column while keeping the result row narrowed to the selected keys.

## Type Parameters

### T

`T` *extends* `string`

Table name used to infer JSON-capable columns and fields.

## Properties

### alias?

> `optional` **alias?**: `string`

Optional result alias. Defaults to the source column name.

### column

> **column**: `JsonbColumns`\<`T`\>

JSON/JSONB column whose fields should be projected.

### fields

> **fields**: `JsonbFields`\<`T`, `JsonbColumns`\<`T`\>\>[]

Field names to include from the JSON/JSONB column.
