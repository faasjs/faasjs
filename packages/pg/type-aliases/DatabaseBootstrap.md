[@faasjs/pg](../README.md) / DatabaseBootstrap

# Type Alias: DatabaseBootstrap

> **DatabaseBootstrap** = () => `void` \| `Promise`\<`void`\>

Async bootstrap used by [getClient](../functions/getClient.md) when no default client has been cached yet.

The bootstrap is responsible for initializing and caching the default client.
The built-in bootstrap creates that client from `process.env.DATABASE_URL`, while
tools such as `@faasjs/pg-dev` can register a lazy async bootstrap for tests.

## Returns

`void` \| `Promise`\<`void`\>
