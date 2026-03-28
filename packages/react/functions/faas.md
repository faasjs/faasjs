[@faasjs/react](../README.md) / faas

# Function: faas()

> **faas**\<`PathOrData`\>(`action`, `params`, `options?`): `Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](../type-aliases/FaasData.md)\<`PathOrData`\>\>\>

Call the currently configured FaasReactClient.

This helper forwards the request to `getClient`. When the registered
client defines `onError`, the hook is invoked before the promise rejects.

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](../type-aliases/FaasActionUnionType.md)

Action path or response data type used for inference.

## Parameters

### action

[`FaasAction`](../type-aliases/FaasAction.md)\<`PathOrData`\>

Action path to invoke.

### params

[`FaasParams`](../type-aliases/FaasParams.md)\<`PathOrData`\>

Parameters sent to the action.

### options?

[`Options`](../type-aliases/Options.md)

Optional per-request overrides such as headers or base URL.
See the request `Options` type for supported fields such as `headers`, `beforeRequest`,
`request`, `baseUrl`, and `stream`.

## Returns

`Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](../type-aliases/FaasData.md)\<`PathOrData`\>\>\>

Response returned by the active browser client.

## Throws

When the request fails and the active client does not recover inside `onError`.

## Example

```ts
import { faas } from '@faasjs/react'

const response = await faas('posts/get', { id: 1 })

console.log(response.data.title)
```
