[@faasjs/pg](../README.md) / OrderByCondition

# Type Alias: OrderByCondition\<T\>

> **OrderByCondition**\<`T`\> = \{ `column`: [`ColumnName`](ColumnName.md)\<`T`\> \| `string`; `direction`: [`QueryOrderDirection`](QueryOrderDirection.md); `type`: `"column"`; \} \| \{ `params`: `any`[]; `sql`: `string`; `type`: `"raw"`; \}

## Type Parameters

### T

`T` _extends_ `string`
