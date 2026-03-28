[@faasjs/ant-design](../README.md) / useApp

# Function: useApp()

> **useApp**\<`NewT`\>(`this`): `Readonly`\<`NewT`\>

Read app-level services exposed by the root `App` component.

## Type Parameters

### NewT

`NewT` _extends_ [`useAppProps`](../interfaces/useAppProps.md) = [`useAppProps`](../interfaces/useAppProps.md)

Narrowed app context shape to read from `AppContext`.

## Parameters

### this

`void`

## Returns

`Readonly`\<`NewT`\>

Read-only app context value.

## Example

```tsx
import { App, useApp } from '@faasjs/ant-design'
import { Button } from 'antd'

function Page() {
  const { message, setModalProps } = useApp()

  return (
    <Button
      onClick={() => {
        message.success('Saved')
        setModalProps({ open: true, title: 'Done', children: 'Profile updated.' })
      }}
    >
      Save
    </Button>
  )
}

export function Root() {
  return (
    <App>
      <Page />
    </App>
  )
}
```
