[@faasjs/ant-design](../README.md) / ConfigProvider

# Function: ConfigProvider()

> **ConfigProvider**(`props`): `Element` \| `null`

Provide theme overrides and optional FaasJS client initialization for descendants.

Theme overrides are merged with the built-in defaults. When `theme.lang` is omitted, the
provider infers a default language from `navigator.language`. This is the
low-level FaasJS config boundary; the higher-level `App` component wraps it
together with Ant Design feedback APIs, an error boundary, modal/drawer state,
and optional routing.

## Parameters

### props

[`ConfigProviderProps`](../interfaces/ConfigProviderProps.md)

Theme overrides and optional FaasJS client configuration.

## Returns

`Element` \| `null`

## Example

```tsx
import { Blank, ConfigProvider } from '@faasjs/ant-design'

function OrdersEmptyState() {
  return <Blank />
}

export function OrdersPage() {
  return (
    <ConfigProvider
      theme={{
        common: { blank: 'No orders yet' },
        Title: { suffix: 'Acme Admin' },
      }}
    >
      <OrdersEmptyState />
    </ConfigProvider>
  )
}
```
