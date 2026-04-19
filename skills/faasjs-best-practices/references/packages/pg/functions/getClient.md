[@faasjs/pg](../README.md) / getClient

# Function: getClient()

> **getClient**(`url?`): [`Client`](../classes/Client.md)

Returns a cached client created by [createClient](createClient.md).

When `url` is omitted and the cache contains exactly one client, that client
is returned. When the cache is empty and `process.env.DATABASE_URL` is set,
a client is created from that URL, cached, and returned. Throws when no
client can be resolved.

## Parameters

### url?

`string`

## Returns

[`Client`](../classes/Client.md)

## Throws

When the requested URL is not cached.

## Throws

When multiple cached clients exist and `url` is omitted.

## Throws

When no cached client exists and `process.env.DATABASE_URL` is not set.

## Example

```ts
import { getClient } from '@faasjs/pg'

const client = getClient()
const users = await client.query('users')
```
