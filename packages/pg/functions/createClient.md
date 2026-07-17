[@faasjs/pg](../README.md) / createClient

# Function: createClient()

> **createClient**\<`T`>>>>\>(`url`, `options?`): [`Client`](../classes/Client.md)

Creates a new instance of the `Client` class from a PostgreSQL connection string.

The returned client is cached by URL for [getClient](getClient.md). When `options.max` is omitted,
the pool size is read from `process.env.PG_POOL_MAX`; unset uses `10`. `PG_POOL_MAX`
must be a positive safe integer.

## Type Parameters

### T

`T` _extends_ `Record`\<`string`, `PostgresType`\<`any`\>\> = `Record`\<`string`, `never`\>

## Parameters

### url

`string`

The PostgreSQL connection string.

### options?

[`ClientOptions`](../type-aliases/ClientOptions.md)\<`T`\>

Optional `postgres.js` options. When `options.max` is omitted,
the default pool size is read from `process.env.PG_POOL_MAX` and falls
back to `10`.

## Returns

[`Client`](../classes/Client.md)

A new `Client` instance.

## Throws

When `url` is not a string.

## Throws

When `PG_POOL_MAX` is invalid.

## Example

```ts
import { createClient } from '@faasjs/pg'

const client = createClient('postgres://user:pass@localhost:5432/db')
```
