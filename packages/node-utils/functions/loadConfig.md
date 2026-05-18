[@faasjs/node-utils](../README.md) / loadConfig

# Function: loadConfig()

> **loadConfig**(`root`, `filename`, `staging`, `logger?`): [`FuncConfig`](../type-aliases/FuncConfig.md)

Resolve the staged `faas.yaml` config for an API file.

This walks from `root` to the API directory, merges every discovered `faas.yaml`,
applies the `defaults` stage, and annotates plugin entries with their resolved `name`.

## Parameters

### root

`string`

Project root directory used to scope config discovery.

### filename

`string`

API filename whose directory controls nested config lookup.

### staging

`string`

Staging name to resolve.

### logger?

[`Logger`](../classes/Logger.md)

Optional logger used while loading config files.

## Returns

[`FuncConfig`](../type-aliases/FuncConfig.md)

Resolved config for the requested staging.

## Throws

If a discovered `faas.yaml` cannot be parsed or fails schema validation.

## Example

```ts
import { loadConfig } from '@faasjs/node-utils'

const config = loadConfig(process.cwd(), '/project/src/orders/create.api.ts', 'development')
```
