[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / useDrawer

# Function: useDrawer()

> **useDrawer**(`init?`): `object`

Create a hook-managed Ant Design drawer instance.

The returned setter shallow-merges partial updates into the drawer props. When
an update sets `open` to `false`, previous drawer props are discarded and the
drawer resets to its initial props.

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

> **drawerProps**: [`DrawerProps`](../interfaces/DrawerProps.md)

### setDrawerProps

> **setDrawerProps**: `Dispatch`\<`SetStateAction`\<[`DrawerProps`](../interfaces/DrawerProps.md)>>>>>>>>>>>>\>\>

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
