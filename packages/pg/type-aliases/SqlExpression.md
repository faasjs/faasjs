[@faasjs/pg](../README.md) / SqlExpression

# Type Alias: SqlExpression

> **SqlExpression** = `object`

A parameterized SQL expression created by [sql](../variables/sql.md).

Expressions can be used as values in [QueryBuilder.update](../classes/QueryBuilder.md#update). Static template
text is treated as trusted application SQL, identifiers should be inserted with
`sql.ref()`, and every other interpolation is bound as a query parameter.

## Properties

### \[SQL\_EXPRESSION\]

> `readonly` **\[SQL\_EXPRESSION\]**: `true`

### params

> `readonly` **params**: readonly `unknown`[]

### text

> `readonly` **text**: `string`
