[@faasjs/ant-design](../README.md) / faas

# Function: faas()

> **faas**\<`PathOrData`\>(`action`, `params`, `options?`): `Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

Call the currently configured FaasReactClient.

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

## Returns

`Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

Response returned by the active browser client.

## Example

```ts
import { faas } from '@faasjs/react'

const response = await faas<{ title: string }>('post/get', { id: 1 })

console.log(response.data.title)
```
