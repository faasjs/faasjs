[@faasjs/pg](../README.md) / ClientOptions

# Type Alias: ClientOptions\<T\>

> **ClientOptions**\<`T`> > > > \> = `postgres.Options`\<`T`>>>>\>

Options for creating a PostgreSQL client. Extends `postgres.js` options.

When `max` is omitted, `@faasjs/pg` supplies a pool size from `process.env.PG_POOL_MAX`
or falls back to `10`. Set `max` explicitly to bypass the environment default.

## Type Parameters

### T

`T` _extends_ `Record`\<`string`, `PostgresType`\> = `Record`\<`string`, `never`\>

Custom Postgres type parsers map.
