[@faasjs/node-utils](../README.md) / loadEnvFileIfExists

# Function: loadEnvFileIfExists()

> **loadEnvFileIfExists**(`options?`): `string` \| `null`

Load a dotenv file if it exists.

- Defaults to `${process.cwd()}/.env`.
- Existing environment variables are preserved (Node.js behavior).

## Parameters

### options?

[`LoadEnvFileIfExistsOptions`](../type-aliases/LoadEnvFileIfExistsOptions.md) = `{}`

## Returns

`string` \| `null`
