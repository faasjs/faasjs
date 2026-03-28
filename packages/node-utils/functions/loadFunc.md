[@faasjs/node-utils](../README.md) / loadFunc

# Function: loadFunc()

> **loadFunc**\<`TEvent`, `TContext`, `TResult`\>(`root`, `filename`, `staging`): `Promise`\<[`ExportedHandler`](../type-aliases/ExportedHandler.md)\<`TEvent`, `TContext`, `TResult`\>\>

Load a packaged FaasJS function, attach its resolved config, and return the exported handler.

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

Path to the packaged FaasJS function file to load.

### staging

`string`

Staging name used when locating config.

## Returns

`Promise`\<[`ExportedHandler`](../type-aliases/ExportedHandler.md)\<`TEvent`, `TContext`, `TResult`\>\>

Promise that resolves to the function handler.

## Throws

If the function module or its `faas.yaml` configuration cannot be loaded.

## Example

```ts
import { loadFunc } from '@faasjs/node-utils'

const handler = await loadFunc(process.cwd(), __dirname + '/example.func.ts', 'development')

const result = await handler(event, context)
console.log(result)
```
