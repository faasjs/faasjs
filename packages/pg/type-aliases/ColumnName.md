[@faasjs/pg](../README.md) / ColumnName

# Type Alias: ColumnName\<T\>

> **ColumnName**\<`T`\> = `T` *extends* keyof [`Tables`](../interfaces/Tables.md) ? `Extract`\<keyof [`Tables`](../interfaces/Tables.md)\[`T`\], `string`\> : `string`

Column-name union for a known table, or `string` for unknown tables.

## Type Parameters

### T

`T` *extends* `string` = `string`
