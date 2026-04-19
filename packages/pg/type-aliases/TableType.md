[@faasjs/pg](../README.md) / TableType

# Type Alias: TableType\<T\>

> **TableType**\<`T`\> = `T` _extends_ [`TableName`](TableName.md) ? [`Tables`](../interfaces/Tables.md)\[`T`\] : `Record`\<`string`, `any`\>

Row type for a known table name, or a permissive record for unknown tables.

## Type Parameters

### T

`T` _extends_ `string` = `string`
