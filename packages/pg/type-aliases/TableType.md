[@faasjs/pg](../README.md) / TableType

# Type Alias: TableType\<T\>

> **TableType**\<`T`\> = `T` *extends* [`TableName`](TableName.md) ? [`Tables`](../interfaces/Tables.md)\[`T`\] : `Record`\<`string`, `any`\>

Row type for a known table name, or a permissive record for unknown tables.

## Type Parameters

### T

`T` *extends* `string` = `string`
