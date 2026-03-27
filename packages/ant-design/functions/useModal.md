[@faasjs/ant-design](../README.md) / useModal

# Function: useModal()

> **useModal**(`init?`): `object`

Hook style modal

## Parameters

### init?

[`ModalProps`](../interfaces/ModalProps.md)

Initial modal props.

Common initial props include `open`, `title`, and `children`.
Other Ant Design `ModalProps` fields are forwarded to the managed modal instance.

## Returns

`object`

### modal

> **modal**: `Element`

### modalProps

> **modalProps**: [`ModalProps`](../interfaces/ModalProps.md) = `props`

### setModalProps

> **setModalProps**: [`setModalProps`](../type-aliases/setModalProps.md)

## Example

```tsx
import { useModal } from '@faasjs/ant-design'
import { Button } from 'antd'

function Example() {
  const { modal, setModalProps } = useModal()

  return (
    <>
      <Button
        onClick={() => setModalProps({ open: true, title: 'Delete', children: 'Are you sure?' })}
      >
        Open Modal
      </Button>
      {modal}
    </>
  )
}
```
