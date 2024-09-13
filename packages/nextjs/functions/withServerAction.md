[@faasjs/nextjs](../README.md) / withServerAction

# Function: withServerAction()

> **withServerAction**\<`TComponentProps`, `TAction`\>(`Component`, `action`, `params`?, `options`?): `React.FC`\<`TComponentProps`\>

HOC to call a server action and handle loading and error states

## Type Parameters

• **TComponentProps** *extends* `object`

• **TAction** *extends* (...`args`) => `Promise`\<`any`\> = `any`

## Parameters

• **Component**: `FC`\<`TComponentProps`\>

• **action**: `TAction`

• **params?**: `Parameters`\<`TAction`\>

• **options?**

• **options.error?**: `ReactNode`

• **options.loading?**: `ReactNode`

## Returns

`React.FC`\<`TComponentProps`\>

## Example

```tsx
import { withServerAction } from '@faasjs/nextjs/client'
import { fetchData } from './fetchData'

const Example = withServerAction(({ data }) => {
 return <div>Data: {data}</div>
}, fetchData, { id: 1 })
```
