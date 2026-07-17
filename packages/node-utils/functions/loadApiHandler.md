[@faasjs/node-utils](../README.md) / loadApiHandler

# Function: loadApiHandler()

> **loadApiHandler**\<`TEvent`, `TContext`, `TResult`>>>>\>(`root`, `filename`, `staging`, `logger?`): `Promise`\<[`ExportedHandler`](../type-aliases/ExportedHandler.md)\<`TEvent`, `TContext`, `TResult`>>>>>>>>\>\>

Load a packaged FaasJS API file, attach its resolved config, and return the exported handler.

The API module is loaded through [loadPackage](loadPackage.md), so it must default-export
a FaasJS API instance. That instance must expose an `export()` method that
returns an object with a promise-based `handler`. Before the handler is
returned, [loadPlugins](loadPlugins.md) merges staged config and applies YAML-driven
plugin instances.

## Type Parameters

### TEvent

`TEvent` = `any`

Runtime event type.

### TContext

`TContext` = `any`

Runtime context type.

### TResult

`TResult` = `any`

Async result type returned by the handler.

## Parameters

### root

`string`

Project root directory used to resolve configuration.

### filename

`string`

Path to the packaged FaasJS API file to load.

### staging

`string`

Staging name used when locating config.

### logger?

[`Logger`](../classes/Logger.md)

Optional logger used for debug output during loading.

## Returns

`Promise`\<[`ExportedHandler`](../type-aliases/ExportedHandler.md)\<`TEvent`, `TContext`, `TResult`\>\>

Promise that resolves to the API handler.

## Throws

If the API module or its `faas.yaml` configuration cannot be loaded.

## Example

```ts
import { loadApiHandler } from '@faasjs/node-utils'

const handler = await loadApiHandler(process.cwd(), __dirname + '/example.api.ts', 'development')

const result = await handler(event, context)
console.log(result)
```
