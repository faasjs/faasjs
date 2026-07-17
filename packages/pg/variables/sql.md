[@faasjs/pg](../README.md) / sql

# Variable: sql

> `const` **sql**: (`strings`, ...`values`) => [`SqlExpression`](../type-aliases/SqlExpression.md) & `object`

Creates a parameterized SQL expression for [QueryBuilder.update](../classes/QueryBuilder.md#update).

Use sql.ref for identifiers. All other interpolated values are converted
to bound parameters; never concatenate runtime input into the static template text.

## Type Declaration

### ref

> **ref**: (`identifier`) => [`SqlReference`](../type-aliases/SqlReference.md)

Creates an escaped SQL identifier reference for interpolation into sql.

#### Parameters

##### identifier

`string`

#### Returns

[`SqlReference`](../type-aliases/SqlReference.md)

## Example

```ts
await client
  .query('jobs')
  .where('id', id)
  .update({
    attempts: sql`${sql.ref('attempts')} + ${1}`,
    updated_at: sql`NOW()`,
  })
```
