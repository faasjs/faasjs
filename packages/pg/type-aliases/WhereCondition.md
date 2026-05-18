[@faasjs/pg](../README.md) / WhereCondition

# Type Alias: WhereCondition\<T\>

> **WhereCondition**\<`T`\> = \{ `column`: [`ColumnName`](ColumnName.md)\<`T`\> \| `string`; `kind`: `"column"`; `operator`: [`Operator`](Operator.md); `type`: `"AND"` \| `"OR"`; `value`: `any`; \} \| \{ `kind`: `"raw"`; `params`: `any`[]; `sql`: `string`; `type`: `"AND"` \| `"OR"`; \}

## Type Parameters

### T

`T` _extends_ `string`
