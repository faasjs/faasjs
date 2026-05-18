[@faasjs/pg](../README.md) / ColumnValue

# Type Alias: ColumnValue\<T, C\>

> **ColumnValue**\<`T`, `C`\> = `T` _extends_ [`TableName`](TableName.md) ? `C` _extends_ keyof [`Tables`](../interfaces/Tables.md)\[`T`\] ? [`Tables`](../interfaces/Tables.md)\[`T`\]\[`C`\] : `any` : `any`

Value type for a known table column, or `any` when the table or column is unknown.

## Type Parameters

### T

`T` _extends_ `string` = `string`

### C

`C` _extends_ `string` = `string`
