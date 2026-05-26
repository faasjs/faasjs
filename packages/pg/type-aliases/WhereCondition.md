[@faasjs/pg](../README.md) / WhereCondition

# Type Alias: WhereCondition\<T\>

> **WhereCondition**\<`T`\> = \{ `column`: [`ColumnName`](ColumnName.md)\<`T`\> \| `string`; `kind`: `"column"`; `operator`: [`Operator`](Operator.md); `type`: `"AND"` \| `"OR"`; `value`: `any`; \} \| \{ `kind`: `"raw"`; `params`: `any`[]; `sql`: `string`; `type`: `"AND"` \| `"OR"`; \}

Describes a single WHERE clause condition, either a column-based comparison or a raw SQL fragment.

## Type Parameters

### T

`T` _extends_ `string`
