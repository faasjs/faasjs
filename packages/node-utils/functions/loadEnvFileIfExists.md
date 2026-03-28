[@faasjs/node-utils](../README.md) / loadEnvFileIfExists

# Function: loadEnvFileIfExists()

> **loadEnvFileIfExists**(`options?`): `string` \| `null`

Load a dotenv file with Node's built-in `loadEnvFile` when the file exists.

Existing `process.env` values are preserved because Node.js does not overwrite them.

## Parameters

### options?

[`LoadEnvFileIfExistsOptions`](../type-aliases/LoadEnvFileIfExistsOptions.md) = `{}`

Optional working directory and filename overrides.

## Returns

`string` \| `null`

Resolved env file path, or `null` when the file does not exist.

## Throws

If the resolved path exists but cannot be read as a file.

## Example

```ts
import { loadEnvFileIfExists } from '@faasjs/node-utils'

loadEnvFileIfExists({
  cwd: process.cwd(),
  filename: '.env.local',
})
```
