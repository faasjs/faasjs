[@faasjs/ant-design](../README.md) / useApp

# Function: useApp()

> **useApp**(): `Readonly`\<[`useAppProps`](../interfaces/useAppProps.md)\>

Get app context.

```ts
import { useApp } from '@faasjs/ant-design'

const { message, notification, setModalProps, setDrawerProps } = useApp()
```

## Returns

`Readonly`\<[`useAppProps`](../interfaces/useAppProps.md)\>

## Example

```tsx
function ChildComponent() {
  const { value, setValue } = use()

  return <div>{value}<button onClick={() => setValue(1)}>change value</button></div>
}
```
