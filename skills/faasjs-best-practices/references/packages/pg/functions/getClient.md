[@faasjs/pg](../README.md) / getClient

# Function: getClient()

> **getClient**(`url?`): `Promise`\<[`Client`](../classes/Client.md)\>

Returns a cached client created by [createClient](createClient.md).

When `url` is omitted and the cache contains exactly one client, that client
is returned. When the cache is empty, the registered async database bootstrap
is awaited to initialize the default client. The built-in bootstrap creates
that client from `process.env.DATABASE_URL`, while callers such as
`@faasjs/pg-dev` can override it for lazy test setup. Throws when no client
can be resolved.

## Parameters

### url?

`string`

## Returns

`Promise`\<[`Client`](../classes/Client.md)\>

## Throws

When the requested URL is not cached.

## Throws

When multiple cached clients exist and `url` is omitted.

## Throws

When the registered database bootstrap does not initialize exactly one default client.

## Example

```ts
import { getClient } from '@faasjs/pg'

const client = await getClient()
const users = await client.query('users')
```
