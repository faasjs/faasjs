[@faasjs/ant-design](../README.md) / useModal

# Function: useModal()

> **useModal**(`init`?): `Object`

Hook style modal

```tsx
function Example() {
  const { modal, setModalProps } = useModal()

  return <>
    <Button onClick={() => setModalProps({ open: true })}>Open Modal</Button>
    {modal}
  </>
}
```

## Parameters

• **init?**: [`ModalProps`](../interfaces/ModalProps.md)

## Returns

`Object`

> ### modal
>
> > **modal**: `Element`
>
> ### modalProps
>
> > **modalProps**: [`ModalProps`](../interfaces/ModalProps.md) = `props`
>
> ### setModalProps
>
> > **setModalProps**: [`setModalProps`](../type-aliases/setModalProps.md)
>
