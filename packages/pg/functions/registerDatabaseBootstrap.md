[@faasjs/pg](../README.md) / registerDatabaseBootstrap

# Function: registerDatabaseBootstrap()

> **registerDatabaseBootstrap**(`bootstrap`): `void`

Replaces the async bootstrap used by [getClient](getClient.md) for the default client path.

## Parameters

### bootstrap

[`DatabaseBootstrap`](../type-aliases/DatabaseBootstrap.md)

Function that initializes the default PostgreSQL client
cache when `getClient()` is called without an explicit URL and no client is cached yet.

## Returns

`void`
