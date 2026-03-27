[@faasjs/node-utils](../README.md) / loadEnvFileIfExists

# Function: loadEnvFileIfExists()

> **loadEnvFileIfExists**(`options?`): `string` \| `null`

Load a dotenv file if it exists.

- Defaults to `${process.cwd()}/.env`.
- Existing environment variables are preserved (Node.js behavior).

## Parameters

### options?

[`LoadEnvFileIfExistsOptions`](../type-aliases/LoadEnvFileIfExistsOptions.md) = `{}`

Optional working directory and filename overrides.

## Returns

`string` \| `null`

## Example

```ts
import { loadEnvFileIfExists } from '@faasjs/node-utils'

loadEnvFileIfExists({
  cwd: process.cwd(),
  filename: '.env.local',
})
```
