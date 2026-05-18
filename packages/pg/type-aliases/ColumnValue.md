[@faasjs/pg](../README.md) / ColumnValue

# Type Alias: ColumnValue\<T, C\>

> **ColumnValue**\<`T`, `C`\> = `T` *extends* [`TableName`](TableName.md) ? `C` *extends* keyof [`Tables`](../interfaces/Tables.md)\[`T`\] ? [`Tables`](../interfaces/Tables.md)\[`T`\]\[`C`\] : `any` : `any`

Value type for a known table column, or `any` when the table or column is unknown.

## Type Parameters

### T

`T` *extends* `string` = `string`

### C

`C` *extends* `string` = `string`
