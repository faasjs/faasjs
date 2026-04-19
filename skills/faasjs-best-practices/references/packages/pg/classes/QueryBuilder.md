[@faasjs/pg](../README.md) / QueryBuilder

# Class: QueryBuilder\<T, TResult\>

## Type Parameters

### T

`T` _extends_ `string` = `string`

### TResult

`TResult` = `InferTResult`\<`T`\>[]

## Constructors

### Constructor

> **new QueryBuilder**\<`T`, `TResult`\>(`client`, `table`): `QueryBuilder`\<`T`, `TResult`\>

#### Parameters

##### client

[`Client`](Client.md)

##### table

`T`

#### Returns

`QueryBuilder`\<`T`, `TResult`\>

## Methods

### count()

> **count**(): `Promise`\<`number`\>

Executes a SQL query to count the number of rows in the specified table.

#### Returns

`Promise`\<`number`\>

A promise that resolves to the count of rows in the table.

#### Example

```ts
const count = await db('users').count() // => 2
```

### delete()

> **delete**(): `Promise`\<`any`[]\>

Deletes records from the specified table based on the provided where conditions.

#### Returns

`Promise`\<`any`[]\>

The result of the raw SQL execution.

#### Throws

If no where conditions are provided.

#### Example

```ts
await db('users').where('id', 1).delete() // DELETE FROM users WHERE id = 1
```

### first()

> **first**(): `Promise`\<`TResult` _extends_ `U`[] ? `U` : `TResult` \| `null`\>

#### Returns

`Promise`\<`TResult` _extends_ `U`[] ? `U` : `TResult` \| `null`\>

### insert()

> **insert**\<`FirstValue`, `Returning`\>(`values`, `options?`): `Promise`\<`Returning` _extends_ \[`"*"`\] ? [`TableType`](../type-aliases/TableType.md)\<`T`\>[] : `Returning`\[`number`\] _extends_ keyof [`TableType`](../type-aliases/TableType.md)\<`T`\> ? `Pick`\<[`TableType`](../type-aliases/TableType.md)\<`T`\>, `any`\[`any`\]\>[] : `Record`\<`string`, `any`\>[]\>

Inserts one or more rows into the table.

#### Type Parameters

##### FirstValue

`FirstValue` _extends_ `Partial`\<[`TableType`](../type-aliases/TableType.md)\<`T`\>\>

The type of the first value to insert, which must be a partial of the table type.

##### Returning

`Returning` _extends_ \[`"*"`\] \| keyof [`TableType`](../type-aliases/TableType.md)\<`T`\>[]

The type of the columns to return, which can be an array of keys of the table type or ['*'].

#### Parameters

##### values

`FirstValue` \| \[`FirstValue`, `...{ [K in string]: ColumnValue<T, K> }[]`\]

The value or array of values to insert. If an array, the first value is used to determine the columns.

##### options?

Optional settings for the insert operation.

###### returning?

`Returning`

An array of columns to return, or ['*'] to return all columns.

#### Returns

`Promise`\<`Returning` _extends_ \[`"*"`\] ? [`TableType`](../type-aliases/TableType.md)\<`T`\>[] : `Returning`\[`number`\] _extends_ keyof [`TableType`](../type-aliases/TableType.md)\<`T`\> ? `Pick`\<[`TableType`](../type-aliases/TableType.md)\<`T`\>, `any`\[`any`\]\>[] : `Record`\<`string`, `any`\>[]\>

#### Example

```ts
await db('users').insert({ id: 3, name: 'Charlie' }) // => []

await db('users').insert({ id: 3, name: 'Charlie' }, { returning: ['name'] }) // => [{ name: 'Charlie' }]

await db('users').insert([
  { id: 4, name: 'David' },
  { id: 5, name: 'Eve' },
]) // => []
```

### join()

#### Call Signature

> **join**(`table`, `left`, `right`): `QueryBuilder`\<`T`, `TResult`\>

Adds an INNER JOIN clause.

##### Parameters

###### table

`string` \| [`RawSql`](../type-aliases/RawSql.md)

###### left

`string` \| [`RawSql`](../type-aliases/RawSql.md)

###### right

`string` \| [`RawSql`](../type-aliases/RawSql.md)

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

#### Call Signature

> **join**(`table`, `left`, `operator`, `right`): `QueryBuilder`\<`T`, `TResult`\>

Adds an INNER JOIN clause.

##### Parameters

###### table

`string` \| [`RawSql`](../type-aliases/RawSql.md)

###### left

`string` \| [`RawSql`](../type-aliases/RawSql.md)

###### operator

`">"` \| `">="` \| `"<="` \| `"="` \| `"!="` \| `"<"`

###### right

`string` \| [`RawSql`](../type-aliases/RawSql.md)

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

### leftJoin()

#### Call Signature

> **leftJoin**(`table`, `left`, `right`): `QueryBuilder`\<`T`, `TResult`\>

Adds a LEFT JOIN clause.

##### Parameters

###### table

`string` \| [`RawSql`](../type-aliases/RawSql.md)

###### left

`string` \| [`RawSql`](../type-aliases/RawSql.md)

###### right

`string` \| [`RawSql`](../type-aliases/RawSql.md)

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

#### Call Signature

> **leftJoin**(`table`, `left`, `operator`, `right`): `QueryBuilder`\<`T`, `TResult`\>

Adds a LEFT JOIN clause.

##### Parameters

###### table

`string` \| [`RawSql`](../type-aliases/RawSql.md)

###### left

`string` \| [`RawSql`](../type-aliases/RawSql.md)

###### operator

`">"` \| `">="` \| `"<="` \| `"="` \| `"!="` \| `"<"`

###### right

`string` \| [`RawSql`](../type-aliases/RawSql.md)

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

### limit()

> **limit**(`value`): `QueryBuilder`\<`T`, `TResult`\>

Sets the limit value for the query.

#### Parameters

##### value

`number`

The maximum number of records to retrieve.

#### Returns

`QueryBuilder`\<`T`, `TResult`\>

#### Example

```ts
await query('users').limit(10) // LIMIT 10
```

### offset()

> **offset**(`value`): `QueryBuilder`\<`T`, `TResult`\>

Sets the offset value for the query.

#### Parameters

##### value

`number`

The number of records to skip.

#### Returns

`QueryBuilder`\<`T`, `TResult`\>

#### Example

```ts
await query('users').offset(10) // OFFSET 10
```

### orderBy()

> **orderBy**\<`C`\>(`column`, `direction?`): `QueryBuilder`\<`T`, `TResult`\>

Sets the order by column and direction for the query.

#### Type Parameters

##### C

`C` _extends_ `string`

#### Parameters

##### column

`C`

The column to order by.

##### direction?

`"ASC"` \| `"DESC"` \| `"asc"` \| `"desc"`

The direction to order by.

#### Returns

`QueryBuilder`\<`T`, `TResult`\>

#### Example

```ts
await query('users').orderBy('id', 'DESC') // ORDER BY id DESC
```

### orderByRaw()

> **orderByRaw**(`sql`, ...`params`): `QueryBuilder`\<`T`, `TResult`\>

Adds a raw SQL expression to ORDER BY with parameter bindings.

#### Parameters

##### sql

`string`

##### params

...`any`[]

#### Returns

`QueryBuilder`\<`T`, `TResult`\>

### orWhere()

#### Call Signature

> **orWhere**\<`C`\>(`column`, `operator`, `value?`): `QueryBuilder`\<`T`, `TResult`\>

Applies an OR WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### operator

`">"` \| `">="` \| `"<="` \| `"="` \| `"!="` \| `"<"`

The operator to use for comparison.

###### value?

[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>

The value to compare against.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1).orWhere('id', 2) // WHERE id = 1 OR id = 2
```

#### Call Signature

> **orWhere**\<`C`\>(`column`, `operator`, `value`): `QueryBuilder`\<`T`, `TResult`\>

Applies an OR WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### operator

`"IN"` \| `"NOT IN"`

The operator to use for comparison.

###### value

[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>[]

The value to compare against.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1).orWhere('id', 2) // WHERE id = 1 OR id = 2
```

#### Call Signature

> **orWhere**\<`C`\>(`column`, `operator`): `QueryBuilder`\<`T`, `TResult`\>

Applies an OR WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### operator

`"IS NULL"` \| `"IS NOT NULL"`

The operator to use for comparison.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1).orWhere('id', 2) // WHERE id = 1 OR id = 2
```

#### Call Signature

> **orWhere**\<`C`\>(`column`, `operator`, `value`): `QueryBuilder`\<`T`, `TResult`\>

Applies an OR WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### operator

`"LIKE"` \| `"ILIKE"` \| `"NOT LIKE"` \| `"NOT ILIKE"`

The operator to use for comparison.

###### value

[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>

The value to compare against.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1).orWhere('id', 2) // WHERE id = 1 OR id = 2
```

#### Call Signature

> **orWhere**\<`C`\>(`column`, `operator`, `value`): `QueryBuilder`\<`T`, `TResult`\>

Applies an OR WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### operator

`"@>"`

The operator to use for comparison.

###### value

`Partial`\<[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>\>

The value to compare against.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1).orWhere('id', 2) // WHERE id = 1 OR id = 2
```

#### Call Signature

> **orWhere**\<`C`\>(`column`, `value`): `QueryBuilder`\<`T`, `TResult`\>

Applies an OR WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### value

[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>

The value to compare against.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1).orWhere('id', 2) // WHERE id = 1 OR id = 2
```

### orWhereRaw()

> **orWhereRaw**(`sql`, ...`params`): `QueryBuilder`\<`T`, `TResult`\>

Adds a raw SQL expression to the WHERE clause using OR with parameter bindings.

#### Parameters

##### sql

`string`

##### params

...`any`[]

#### Returns

`QueryBuilder`\<`T`, `TResult`\>

### pluck()

> **pluck**\<`C`\>(`column`): `Promise`\<[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>[]\>

Asynchronously retrieves the values of a specified column from the database.

#### Type Parameters

##### C

`C` _extends_ `string`

The type of the column name.

#### Parameters

##### column

`C`

The name of the column to pluck values from.

#### Returns

`Promise`\<[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>[]\>

A promise that resolves to an array of values from the specified column.

#### Example

```ts
const names = await db('users').pluck('name') // => ['Alice', 'Bob']
```

### select()

> **select**\<`ColumnNames`\>(...`columns`): `QueryBuilder`\<`T`, `InferTResult`\<`T`, `ColumnNames`\>[]\>

Selects specific columns for the query.

#### Type Parameters

##### ColumnNames

`ColumnNames` _extends_ (`JsonSelectField`\<`T`\> \| [`ColumnName`](../type-aliases/ColumnName.md)\<`T`\>)[]

#### Parameters

##### columns

...`ColumnNames`

The columns to select.

#### Returns

`QueryBuilder`\<`T`, `InferTResult`\<`T`, `ColumnNames`\>[]\>

#### Example

```ts
const users = await db('users').select('id', 'name') // SELECT id, name FROM users

const users = await db('users').select('id', { column: 'data', fields: ['email'] }) // SELECT id, jsonb_build_object('email', data->'email') AS data FROM users
```

### then()

> **then**\<`TResult1`, `TResult2`\>(`onfulfilled?`, `onrejected?`): `Promise`\<`TResult1` \| `TResult2`\>

#### Type Parameters

##### TResult1

`TResult1` = `TResult`

##### TResult2

`TResult2` = `never`

#### Parameters

##### onfulfilled?

((`value`) => `TResult1` \| `PromiseLike`\<`TResult1`\>) \| `null`

##### onrejected?

((`reason`) => `TResult2` \| `PromiseLike`\<`TResult2`\>) \| `null`

#### Returns

`Promise`\<`TResult1` \| `TResult2`\>

### toSql()

> **toSql**(): `object`

#### Returns

`object`

##### params

> **params**: `any`[]

##### sql

> **sql**: `string`

### update()

> **update**\<`Returning`\>(`values`, `options?`): `Promise`\<`Returning` _extends_ \[`"*"`\] ? [`TableType`](../type-aliases/TableType.md)\<`T`\>[] : `Returning`\[`number`\] _extends_ keyof [`TableType`](../type-aliases/TableType.md)\<`T`\> ? `Pick`\<[`TableType`](../type-aliases/TableType.md)\<`T`\>, `any`\[`any`\]\>[] : `Record`\<`string`, `any`\>[]\>

Updates records in the table with the specified values and returns the updated records.

#### Type Parameters

##### Returning

`Returning` _extends_ \[`"*"`\] \| keyof [`TableType`](../type-aliases/TableType.md)\<`T`\>[]

An array of keys of the table type or ['*'] to return all columns.

#### Parameters

##### values

`Partial`\<[`TableType`](../type-aliases/TableType.md)\<`T`\>\>

The values to update in the table.

##### options?

Optional settings for the update operation.

###### returning?

`Returning`

An array of columns to return after the update.

#### Returns

`Promise`\<`Returning` _extends_ \[`"*"`\] ? [`TableType`](../type-aliases/TableType.md)\<`T`\>[] : `Returning`\[`number`\] _extends_ keyof [`TableType`](../type-aliases/TableType.md)\<`T`\> ? `Pick`\<[`TableType`](../type-aliases/TableType.md)\<`T`\>, `any`\[`any`\]\>[] : `Record`\<`string`, `any`\>[]\>

#### Example

```ts
await db('users').where('id', 1).update({ name: 'Alice' }) // => []

await db('users')
  .where('id', 1)
  .update({ name: 'Alice' }, { returning: ['name'] }) // => [{ name: 'Alice' }]
```

### upsert()

> **upsert**\<`FirstValue`, `Returning`\>(`values`, `options`): `Promise`\<`Returning` _extends_ \[`"*"`\] ? [`TableType`](../type-aliases/TableType.md)\<`T`\>[] : `Returning`\[`number`\] _extends_ keyof [`TableType`](../type-aliases/TableType.md)\<`T`\> ? `Pick`\<[`TableType`](../type-aliases/TableType.md)\<`T`\>, `any`\[`any`\]\>[] : `Record`\<`string`, `any`\>[]\>

Inserts or updates records in the database table.

#### Type Parameters

##### FirstValue

`FirstValue` _extends_ `Partial`\<[`TableType`](../type-aliases/TableType.md)\<`T`\>\>

A partial type of the table's row type.

##### Returning

`Returning` _extends_ \[`"*"`\] \| keyof `FirstValue`[]

#### Parameters

##### values

`FirstValue` \| \[`FirstValue`, `...{ [K in string]: ColumnValue<T, K> }[]`\]

The values to insert or update. Can be a single object or an array of objects.

##### options

The options for the upsert operation.

###### conflict

[`ColumnName`](../type-aliases/ColumnName.md)\<`T`\>[]

The columns to check for conflicts.

###### returning?

`Returning`

The columns to return after the upsert operation.

###### update?

keyof `FirstValue`[]

The columns to update if a conflict occurs.

#### Returns

`Promise`\<`Returning` _extends_ \[`"*"`\] ? [`TableType`](../type-aliases/TableType.md)\<`T`\>[] : `Returning`\[`number`\] _extends_ keyof [`TableType`](../type-aliases/TableType.md)\<`T`\> ? `Pick`\<[`TableType`](../type-aliases/TableType.md)\<`T`\>, `any`\[`any`\]\>[] : `Record`\<`string`, `any`\>[]\>

- A promise that resolves to the result of the upsert operation.

#### Example

```ts
await db('users').upsert({ id: 1, name: 'Alice' }, { conflict: ['id'], update: ['name'] }) // => []
```

### where()

#### Call Signature

> **where**\<`C`\>(`column`, `operator`, `value?`): `QueryBuilder`\<`T`, `TResult`\>

Applies a WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### operator

`">"` \| `">="` \| `"<="` \| `"="` \| `"!="` \| `"<"`

The operator to use for comparison.

###### value?

[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>

The value to compare against.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1) // WHERE id = 1

await query('users').where('id', '>', 1) // WHERE id > 1

await query('users').where('id', 'IN', [1, 2, 3]) // WHERE id IN (1, 2, 3)

await query('users').where('data', '@>', { email: 'example@example.com' }) // WHERE data @> '{"email": "example@example.com"}'
```

#### Call Signature

> **where**\<`C`\>(`column`, `operator`, `value`): `QueryBuilder`\<`T`, `TResult`\>

Applies a WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### operator

`"IN"` \| `"NOT IN"`

The operator to use for comparison.

###### value

[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>[]

The value to compare against.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1) // WHERE id = 1

await query('users').where('id', '>', 1) // WHERE id > 1

await query('users').where('id', 'IN', [1, 2, 3]) // WHERE id IN (1, 2, 3)

await query('users').where('data', '@>', { email: 'example@example.com' }) // WHERE data @> '{"email": "example@example.com"}'
```

#### Call Signature

> **where**\<`C`\>(`column`, `operator`): `QueryBuilder`\<`T`, `TResult`\>

Applies a WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### operator

`"IS NULL"` \| `"IS NOT NULL"`

The operator to use for comparison.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1) // WHERE id = 1

await query('users').where('id', '>', 1) // WHERE id > 1

await query('users').where('id', 'IN', [1, 2, 3]) // WHERE id IN (1, 2, 3)

await query('users').where('data', '@>', { email: 'example@example.com' }) // WHERE data @> '{"email": "example@example.com"}'
```

#### Call Signature

> **where**\<`C`\>(`column`, `operator`, `value`): `QueryBuilder`\<`T`, `TResult`\>

Applies a WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### operator

`"LIKE"` \| `"ILIKE"` \| `"NOT LIKE"` \| `"NOT ILIKE"`

The operator to use for comparison.

###### value

[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>

The value to compare against.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1) // WHERE id = 1

await query('users').where('id', '>', 1) // WHERE id > 1

await query('users').where('id', 'IN', [1, 2, 3]) // WHERE id IN (1, 2, 3)

await query('users').where('data', '@>', { email: 'example@example.com' }) // WHERE data @> '{"email": "example@example.com"}'
```

#### Call Signature

> **where**\<`C`\>(`column`, `operator`, `value`): `QueryBuilder`\<`T`, `TResult`\>

Applies a WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### operator

`"@>"`

The operator to use for comparison.

###### value

`Partial`\<[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>\>

The value to compare against.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1) // WHERE id = 1

await query('users').where('id', '>', 1) // WHERE id > 1

await query('users').where('id', 'IN', [1, 2, 3]) // WHERE id IN (1, 2, 3)

await query('users').where('data', '@>', { email: 'example@example.com' }) // WHERE data @> '{"email": "example@example.com"}'
```

#### Call Signature

> **where**\<`C`\>(`column`, `value`): `QueryBuilder`\<`T`, `TResult`\>

Applies a WHERE condition to the query builder.

##### Type Parameters

###### C

`C` _extends_ `string`

##### Parameters

###### column

`C`

The column to filter on.

###### value

[`ColumnValue`](../type-aliases/ColumnValue.md)\<`T`, `C`\>

The value to compare against.

##### Returns

`QueryBuilder`\<`T`, `TResult`\>

##### Example

```ts
await query('users').where('id', 1) // WHERE id = 1

await query('users').where('id', '>', 1) // WHERE id > 1

await query('users').where('id', 'IN', [1, 2, 3]) // WHERE id IN (1, 2, 3)

await query('users').where('data', '@>', { email: 'example@example.com' }) // WHERE data @> '{"email": "example@example.com"}'
```

### whereRaw()

> **whereRaw**(`sql`, ...`params`): `QueryBuilder`\<`T`, `TResult`\>

Adds a raw SQL expression to the WHERE clause with parameter bindings.

#### Parameters

##### sql

`string`

##### params

...`any`[]

#### Returns

`QueryBuilder`\<`T`, `TResult`\>
