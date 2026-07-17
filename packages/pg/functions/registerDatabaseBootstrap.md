[**@faasjs/pg**](../README.md)

[@faasjs/pg](../README.md) / registerDatabaseBootstrap

# Function: registerDatabaseBootstrap()

> **registerDatabaseBootstrap**(`bootstrap`): `void`

Replaces the async bootstrap used by [getClient](getClient.md) for the default client path.

The replacement is process-wide for the current module instance. It is primarily
intended for test harnesses and local tooling that must lazily start a database
before the first default `getClient()` call.

## Parameters

### bootstrap

[`DatabaseBootstrap`](../type-aliases/DatabaseBootstrap.md)

Function that initializes the default PostgreSQL client
cache when `getClient()` is called without an explicit URL and no client is cached yet.

## Returns

`void`
