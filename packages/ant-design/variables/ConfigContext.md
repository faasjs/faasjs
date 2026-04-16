[@faasjs/ant-design](../README.md) / ConfigContext

# Variable: ConfigContext

> `const` **ConfigContext**: `Context`\<`ConfigContextValue`\>

Low-level React context that stores the resolved theme from [ConfigProvider](../functions/ConfigProvider.md).

Most app code should call [useConfigContext](../functions/useConfigContext.md) instead of reading this context directly.

## Example

```tsx
import { ConfigContext, ConfigProvider } from '@faasjs/ant-design'
import { useContext } from 'react'

function OrdersHeader() {
  const { theme } = useContext(ConfigContext)

  return <h1>{`Orders - ${theme.Title.suffix}`}</h1>
}

export function OrdersPage() {
  return (
    <ConfigProvider
      theme={{
        common: { blank: 'No orders yet' },
        Title: { suffix: 'Acme Admin' },
      }}
    >
      <OrdersHeader />
    </ConfigProvider>
  )
}
```
