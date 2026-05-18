[@faasjs/ant-design](../README.md) / faas

# Function: faas()

> **faas**\<`PathOrData`\>(`action`, `params`, `options?`): `Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

Call the currently configured FaasReactClient.

This helper forwards the request to `getClient`. When the registered
client defines `onError`, the hook is invoked before the promise rejects.

## Type Parameters

### PathOrData

`PathOrData` _extends_ `FaasActionUnionType`

Action path or response data type used for inference.

## Parameters

### action

`FaasAction`\<`PathOrData`\>

Action path to invoke.

### params

`FaasParams`\<`PathOrData`\>

Parameters sent to the action.

### options?

`Options`

Optional per-request overrides such as headers or base URL.
See the browser-client `Options` type for supported fields such as `headers`, `beforeRequest`,
`request`, `baseUrl`, and `stream`.

## Returns

`Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

Response returned by the active browser client.

## Throws

When the request fails and the active client does not recover inside `onError`.

## Example

```ts
import { faas } from '@faasjs/react'

const response = await faas('posts/get', { id: 1 })

console.log(response.data.title)
```
