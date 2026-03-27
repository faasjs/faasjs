[@faasjs/ant-design](../README.md) / useThemeToken

# Function: useThemeToken()

> **useThemeToken**(): `GlobalToken`

Hook to retrieve the theme token from the Ant Design theme configuration.

This function uses the `theme.useToken` method to get the current theme configuration
and returns the `token` property from the configuration.

## Returns

`GlobalToken`

The theme token from the Ant Design theme configuration.

## Example

```tsx
import { useThemeToken } from '@faasjs/ant-design'

function PrimarySwatch() {
  const { colorPrimary } = useThemeToken()

  return <div style={{ width: 24, height: 24, background: colorPrimary }} />
}
```
