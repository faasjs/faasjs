[@faasjs/pg](../README.md) / Client

# Class: Client

## Constructors

### Constructor

> **new Client**(`url`, `options?`): `Client`

#### Parameters

##### url

`string`

##### options?

`AnyClientOptions`

#### Returns

`Client`

## Methods

### query()

> **query**\<`T`\>(`table`): [`QueryBuilder`](QueryBuilder.md)\<`T`\>

Initiates a query builder for the specified table.

#### Type Parameters

##### T

`T` _extends_ [`TableName`](../type-aliases/TableName.md)

The type of the table name.

#### Parameters

##### table

`T`

The name of the table to query.

#### Returns

[`QueryBuilder`](QueryBuilder.md)\<`T`\>

A new instance of the QueryBuilder for the specified table.

#### Example

```ts
const users = await client.query('users').where('id', userId)
```

### quit()

> **quit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### raw()

> **raw**\<`T`\>(`query`, ...`params`): `Promise`\<`T`[]\>

Executes a raw SQL query and returns the result as an array of objects.

#### Type Parameters

##### T

`T` _extends_ `Record`\<`string`, `any`\> = `any`

The type of the result objects. Defaults to `Record<string, any>`.

#### Parameters

##### query

`string` \| `TemplateStringsArray`

The SQL query to execute. Can be a string or a template string array.

##### params

...`any`[]

The parameters to pass to the SQL query.

#### Returns

`Promise`\<`T`[]\>

A promise that resolves to an array of objects of type `T`.

#### Example

```ts
// using a template string array
const users = await client.raw<User>`SELECT * FROM users`
// using a string
const users = await client.raw<User>('SELECT * FROM users')
// template string array with parameters
const users = await client.raw<User>`SELECT * FROM users WHERE id = ${userId}`
// string with parameters
const users = await client.raw<User>('SELECT * FROM users WHERE id = ?', userId)
```

### transaction()

> **transaction**\<`T`\>(`fn`): `Promise`\<`UnwrapPromiseArray`\<`T`\>\>

Executes a function within a database transaction.

#### Type Parameters

##### T

`T`

The type of the result returned by the transaction function.

#### Parameters

##### fn

(`client`) => `Promise`\<`T`\>

A function that takes a `Client` instance and returns a promise.

#### Returns

`Promise`\<`UnwrapPromiseArray`\<`T`\>\>

- A promise that resolves to the result of the transaction function.

#### Example

```ts
const result = await client.transaction(async (trx) => {
  return await trx.query('users').insert({ name: 'Alice' })
})
```

## Properties

### logger

> `readonly` **logger**: `Logger`

### options

> `readonly` **options**: [`ClientOptions`](../type-aliases/ClientOptions.md)\<`Record`\<`string`, `PostgresType`\<`any`\>\>\>

### postgres

> `readonly` **postgres**: `Sql`
