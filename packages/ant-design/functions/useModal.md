[@faasjs/ant-design](../README.md) / useModal

# Function: useModal()

> **useModal**(`init?`): `object`

Create a hook-managed Ant Design modal instance.

The returned setter merges partial updates into the current modal props instead of replacing the
entire state object.

## Parameters

### init?

[`ModalProps`](../interfaces/ModalProps.md)

Initial modal props.

## Returns

`object`

Hook-managed modal element, current props, and a state-merging setter.

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
