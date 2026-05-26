[@faasjs/pg](../README.md) / InferTResult

# Type Alias: InferTResult\<TName, ColumnNames\>

> **InferTResult**\<`TName`, `ColumnNames`\> = `ColumnNames` _extends_ \[`"*"`\] ? [`TableType`](TableType.md)\<`TName`\> : `MergeTypes`\<`{ [K in keyof ColumnNames]: InferColumnType<TName, ColumnNames[K]> }`\>

Infers the result row type for a SELECT query based on the table name and selected columns.

## Type Parameters

### TName

`TName` _extends_ `string`

The table name.

### ColumnNames

`ColumnNames` _extends_ ([`ColumnName`](ColumnName.md)\<`TName`\> \| [`JsonSelectField`](JsonSelectField.md)\<`TName`\>)[] = [`ColumnName`](ColumnName.md)\<`TName`\>[]

The columns selected, or defaults to all columns.
