[@faasjs/node-utils](../README.md) / loadApiHandler

# Function: loadApiHandler()

> **loadApiHandler**\<`TEvent`, `TContext`, `TResult`\>(`root`, `filename`, `staging`): `Promise`\<[`ExportedHandler`](../type-aliases/ExportedHandler.md)\<`TEvent`, `TContext`, `TResult`\>\>

Load a packaged FaasJS API file, attach its resolved config, and return the exported handler.

The loaded module is expected to expose an `export()` method that returns an object with a `handler`.

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
