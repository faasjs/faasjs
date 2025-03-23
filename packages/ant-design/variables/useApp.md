[@faasjs/ant-design](../README.md) / useApp

# Variable: useApp()

> `const` **useApp**: \<`NewT`\>() => `Readonly`\<`NewT`\> = `AppContext.use`

Get app context.

```ts
import { useApp } from '@faasjs/ant-design'

const { message, notification, setModalProps, setDrawerProps } = useApp()
```

## Type Parameters

### NewT

`NewT` *extends* [`useAppProps`](../interfaces/useAppProps.md) = [`useAppProps`](../interfaces/useAppProps.md)

## Returns

`Readonly`\<`NewT`\>
