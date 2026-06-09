[@faasjs/ant-design](../README.md) / faas

# Function: faas()

> **faas**\<`Path`\>(`action`, `params`, `options?`): `Promise`\<`Response`\<`FaasData`\<`Path`\>\>\>

Call the currently configured FaasReactClient.

In Ant Design apps, import this helper from `@faasjs/ant-design` so failed requests use the
same configured feedback behavior as the rest of the UI.

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

`Options`

Optional per-request overrides such as headers or base URL.

## Returns

`Promise`\<`Response`\<`FaasData`\<`Path`\>\>\>

Response returned by the active browser client.

## Example

```ts
import { faas } from '@faasjs/ant-design'

const response = await faas('features/users/api/get', { id: 1 })
```
