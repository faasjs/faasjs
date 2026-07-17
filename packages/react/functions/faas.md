[@faasjs/react](../README.md) / faas

# Function: faas()

> **faas**\<`Path`>>>>\>(`action`, `params`, `options?`): `Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`Path`>>>>>>>>>>>>\>\>\>

Call the currently configured FaasReactClient.

This helper forwards the request to `getClient`. When the registered
client defines `onError`, the hook is invoked before the promise rejects.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

Registered action path used to infer params and response data.

## Parameters

### action

`Path`

Action path to invoke.

### params

`FaasParams`\<`Path`\>

Parameters sent to the action.

### options?

[`Options`](../type-aliases/Options.md)

Optional per-request overrides such as headers or base URL.
See the browser-client `Options` type for supported fields such as `headers`, `beforeRequest`,
`request`, `baseUrl`, and `stream`.

## Returns

`Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`Path`\>\>\>

Response returned by the active browser client.

## Throws

When the request fails and the active client does not recover inside `onError`.

## Example

```ts
import { faas } from '@faasjs/react'

declare module '@faasjs/types' {
  interface FaasActions {
    'posts/get': {
      Params: { id: number }
      Data: { title: string }
    }
  }
}

const response = await faas<'posts/get'>('posts/get', { id: 1 })

console.log(response.data.title)
```
