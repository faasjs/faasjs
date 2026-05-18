[@faasjs/pg](../README.md) / ColumnName

# Type Alias: ColumnName\<T\>

> **ColumnName**\<`T`\> = `T` _extends_ keyof [`Tables`](../interfaces/Tables.md) ? `Extract`\<keyof [`Tables`](../interfaces/Tables.md)\[`T`\], `string`\> : `string`

Column-name union for a known table, or `string` for unknown tables.

## Type Parameters

### T

`T` _extends_ `string` = `string`
