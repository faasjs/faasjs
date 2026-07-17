[@faasjs/pg](../README.md) / OrderByCondition

# Type Alias: OrderByCondition\<T\>

> **OrderByCondition**\<`T`> > > > \> = \{ `column`: [`ColumnName`](ColumnName.md)\<`T`> > > > \> \| `string`; `direction`: [`QueryOrderDirection`](QueryOrderDirection.md); `type`: `"column"`; \} \| \{ `params`: `any`[]; `sql`: `string`; `type`: `"raw"`; \}

Describes a single ORDER BY condition, either a column reference or a raw SQL fragment.

## Type Parameters

### T

`T` _extends_ `string`
