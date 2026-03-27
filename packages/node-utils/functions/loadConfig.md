[@faasjs/node-utils](../README.md) / loadConfig

# Function: loadConfig()

> **loadConfig**(`root`, `filename`, `staging`, `logger?`): [`FuncConfig`](../type-aliases/FuncConfig.md)

Load resolved config for a function and staging.

## Parameters

### root

`string`

Project root.

### filename

`string`

Function filename.

### staging

`string`

Staging name to resolve.

### logger?

[`Logger`](../classes/Logger.md)

Optional logger.

## Returns

[`FuncConfig`](../type-aliases/FuncConfig.md)

Resolved config for the requested staging.

## Example

```ts
import { loadConfig } from '@faasjs/node-utils'

const config = loadConfig(process.cwd(), '/project/src/orders/create.func.ts', 'development')
```
