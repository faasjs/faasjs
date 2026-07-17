[@faasjs/pg](../README.md) / Client

# Class: Client

PostgreSQL client wrapping `postgres.js` with a fluent query builder API.

Constructing a client creates a `postgres.js` connection pool and caches the instance
by connection URL. A later client created for the same URL replaces the cached
default for that URL; [quit](#quit) only removes the cache entry when it still points
at the same instance.

## Example

```ts
import { createClient } from '@faasjs/pg'
const client = createClient('postgres://user:pass@localhost:5432/db')
const rows = await client.query('users').where('id', 1)
```

## Constructors

### Constructor

> **new Client**(`url`, `options?`): `Client`

#### Parameters

##### url

`string`

PostgreSQL connection string.

##### options?

`AnyClientOptions`

Optional `postgres.js` options. `options.max` overrides `PG_POOL_MAX`.

#### Returns

`Client`

#### Throws

When `url` is not a string.

#### Throws

When `PG_POOL_MAX` is set and is not a positive safe integer.

## Methods

### query()

> **query**\<`T`>>>>\>(`table`): [`QueryBuilder`](QueryBuilder.md)\<`T`>>>>\>

Initiates a query builder for the specified table.

Table and column names are escaped as identifiers by the query builder. Add entries
to the exported `Tables` interface through declaration merging to get typed
table names, columns, values, and selected result rows.

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

> **quit**(): `Promise`\<`void`>>>>\>

Closes the underlying connection pool and removes this client from the cache.

#### Returns

`Promise`\<`void`\>

### raw()

> **raw**\<`T`>>>>\>(`query`, ...`params`): `Promise`\<`T`[]\>

Executes a raw SQL query and returns the result as an array of objects.

Template-literal usage delegates placeholders to `postgres.js` with `${value}`.
String usage treats every `?` as a parameter placeholder and converts the string
into a `TemplateStringsArray` before execution. Use placeholders for values; do
not concatenate user input into the SQL string.

In debug logging mode the SQL template and parameters are timed and query errors
are logged before being rethrown.

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

#### Call Signature

> **transaction**\<`T`>>>>\>(`fn`): `Promise`\<`T`>>>>\>

Executes a function within a database transaction, optionally with an isolation
level and explicit read-only/read-write mode.

The callback receives a lightweight `Client` facade backed by the transactional
`postgres.js` connection. Do not keep that facade after the callback resolves.

##### Type Parameters

###### T

`T`

The type of the result returned by the transaction function.

##### Parameters

###### fn

(`client`) => `Promise`\<`T`\>

A function that takes a transaction-scoped `Client` and returns a promise.

##### Returns

`Promise`\<`T`\>

- A promise that resolves to the result of the transaction function.

##### Example

```ts
const result = await client.transaction(async (trx) => {
  return await trx.query('users').insert({ name: 'Alice' })
})

const snapshot = await client.transaction(
  { isolation: 'repeatable read', readOnly: true },
  async (trx) => trx.query('users'),
)
```

#### Call Signature

> **transaction**\<`T`>>>>\>(`options`, `fn`): `Promise`\<`T`>>>>\>

Executes a function within a database transaction using explicit transaction modes.

##### Type Parameters

###### T

`T`

The type of the result returned by the transaction function.

##### Parameters

###### options

[`TransactionOptions`](../type-aliases/TransactionOptions.md)

Transaction isolation and access-mode settings.

###### fn

(`client`) => `Promise`\<`T`\>

A function that takes a transaction-scoped `Client` and returns a promise.

##### Returns

`Promise`\<`T`\>

A promise that resolves to the result of the transaction function.

## Properties

### logger

> `readonly` **logger**: `Logger`

### options

> `readonly` **options**: [`ClientOptions`](../type-aliases/ClientOptions.md)\<`Record`\<`string`, `PostgresType`\<`any`>>>>>>>>>>>>\>\>\>

### postgres

> `readonly` **postgres**: `Sql`
