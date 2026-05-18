[@faasjs/pg](../README.md) / InferTResult

# Type Alias: InferTResult\<TName, ColumnNames\>

> **InferTResult**\<`TName`, `ColumnNames`\> = `ColumnNames` _extends_ \[`"*"`\] ? [`TableType`](TableType.md)\<`TName`\> : `MergeTypes`\<`{ [K in keyof ColumnNames]: InferColumnType<TName, ColumnNames[K]> }`\>

## Type Parameters

### TName

`TName` _extends_ `string`

### ColumnNames

`ColumnNames` _extends_ ([`ColumnName`](ColumnName.md)\<`TName`\> \| [`JsonSelectField`](JsonSelectField.md)\<`TName`\>)[] = [`ColumnName`](ColumnName.md)\<`TName`\>[]
