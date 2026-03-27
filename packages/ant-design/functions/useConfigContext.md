[@faasjs/ant-design](../README.md) / useConfigContext

# Function: useConfigContext()

> **useConfigContext**(): `ConfigContextValue`

Read the current `@faasjs/ant-design` config context.

## Returns

`ConfigContextValue`

## Example

```tsx
import { ConfigProvider, useConfigContext } from '@faasjs/ant-design'

function EmptyState() {
  const { theme } = useConfigContext()

  return <span>{theme.common.blank}</span>
}

export function Page() {
  return (
    <ConfigProvider theme={{ common: { blank: 'N/A' } }}>
      <EmptyState />
    </ConfigProvider>
  )
}
```
