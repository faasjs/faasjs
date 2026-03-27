[@faasjs/ant-design](../README.md) / useApp

# Function: useApp()

> **useApp**\<`NewT`\>(`this`): `Readonly`\<`NewT`\>

Get app context.

## Type Parameters

### NewT

`NewT` _extends_ [`useAppProps`](../interfaces/useAppProps.md) = [`useAppProps`](../interfaces/useAppProps.md)

## Parameters

### this

`void`

## Returns

`Readonly`\<`NewT`\>

## Example

```ts
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

<App>
  <Page />
</App>
```
