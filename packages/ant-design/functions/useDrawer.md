[@faasjs/ant-design](../README.md) / useDrawer

# Function: useDrawer()

> **useDrawer**(`init?`): `object`

Hook style drawer

## Parameters

### init?

[`DrawerProps`](../interfaces/DrawerProps.md)

Initial drawer props.

Common initial props include `open`, `title`, and `children`.
Other Ant Design `DrawerProps` fields are forwarded to the managed drawer instance.

## Returns

`object`

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
