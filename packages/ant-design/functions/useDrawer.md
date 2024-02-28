[@faasjs/ant-design](../README.md) / useDrawer

# Function: useDrawer()

> **useDrawer**(`init`?): `Object`

Hook style drawer

```tsx
function Example() {
  const { drawer, setDrawerProps } = useDrawer()

  return <>
    <Button onClick={ () => setDrawerProps(prev => ({ open: !prev.open})) }>
      Toggle
    </Button>
    {drawer}
  </>
}
```

## Parameters

• **init?**: [`DrawerProps`](../interfaces/DrawerProps.md)

## Returns

`Object`

### drawer

> **drawer**: `Element`

### drawerProps

> **drawerProps**: [`DrawerProps`](../interfaces/DrawerProps.md) = `props`

### setDrawerProps

> **setDrawerProps**: [`setDrawerProps`](../type-aliases/setDrawerProps.md)
