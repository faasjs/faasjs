[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / useConfigContext

# Function: useConfigContext()

> **useConfigContext**(): [`ConfigContextValue`](../type-aliases/ConfigContextValue.md)

Read the current `@faasjs/ant-design` config context.

## Returns

[`ConfigContextValue`](../type-aliases/ConfigContextValue.md)

Current config context value containing the resolved theme.

## Example

```tsx
import { ConfigProvider, useConfigContext } from '@faasjs/ant-design'

function OrdersSummary() {
  const { theme } = useConfigContext()

  return (
    <>
      <h1>{`Orders - ${theme.Title.suffix}`}</h1>
      <p>{theme.common.blank}</p>
    </>
  )
}

export function OrdersPage() {
  return (
    <ConfigProvider
      theme={{
        common: { blank: 'No orders yet' },
        Title: { suffix: 'Acme Admin' },
      }}
    >
      <OrdersSummary />
    </ConfigProvider>
  )
}
```
