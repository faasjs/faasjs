[@faasjs/ant-design](../README.md) / useDrawer

# Function: useDrawer()

> **useDrawer**(`init?`): `object`

Create a hook-managed Ant Design drawer instance.

The returned setter shallow-merges partial updates into the drawer props instead
of replacing the entire state object. The updater form is also merged after it
returns, so omitted keys stay unchanged.

## Parameters

### init?

[`DrawerProps`](../interfaces/DrawerProps.md)

Initial drawer props.

## Returns

`object`

Hook-managed drawer element, current props, and a state-merging setter.

### drawer

> **drawer**: `Element`

### drawerProps

> **drawerProps**: [`DrawerProps`](../interfaces/DrawerProps.md) = `props`

### setDrawerProps

> **setDrawerProps**: [`setDrawerProps`](../type-aliases/setDrawerProps.md)

## Example

```tsx
import { useDrawer } from '@faasjs/ant-design'
import { Button } from 'antd'

function Example() {
  const { drawer, setDrawerProps } = useDrawer()

  return (
    <>
      <Button
        onClick={() =>
          setDrawerProps({ open: true, title: 'Details', children: <div>Content</div> })
        }
      >
        Open
      </Button>
      {drawer}
    </>
  )
}
```
