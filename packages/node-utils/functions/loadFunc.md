[@faasjs/node-utils](../README.md) / loadFunc

# Function: loadFunc()

> **loadFunc**\<`TEvent`, `TContext`, `TResult`\>(`root`, `filename`, `staging`): `Promise`\<[`ExportedHandler`](../type-aliases/ExportedHandler.md)\<`TEvent`, `TContext`, `TResult`\>\>

Load a FaasJS function and its configuration, returning the handler.

## Type Parameters

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

## Parameters

### root

`string`

Project root directory used to resolve configuration.

### filename

`string`

Path to the packaged FaasJS function file to load.

### staging

`string`

Staging directory name (used when locating config).

## Returns

`Promise`\<[`ExportedHandler`](../type-aliases/ExportedHandler.md)\<`TEvent`, `TContext`, `TResult`\>\>

A promise that resolves to the function handler.

## Example

```ts
import { loadFunc } from '@faasjs/node-utils'

const handler = await loadFunc(
  process.cwd(),
  __dirname + '/example.func.ts',
  'development'
)

const result = await handler(event, context)
console.log(result)
```
