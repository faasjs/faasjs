[@faasjs/react](../README.md) / faas

# Function: faas()

> **faas**\<`PathOrData`\>(`action`, `params`, `options?`): `Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](../type-aliases/FaasData.md)\<`PathOrData`\>\>\>

Call the currently configured FaasReactClient.

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](../type-aliases/FaasActionUnionType.md)

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

## Returns

`Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](../type-aliases/FaasData.md)\<`PathOrData`\>\>\>

Response returned by the active browser client.

## Example

```ts
import { faas } from '@faasjs/react'

const response = await faas<{ title: string }>('post/get', { id: 1 })

console.log(response.data.title)
```
