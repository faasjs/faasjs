[@faasjs/ant-design](../README.md) / useThemeToken

# Function: useThemeToken()

> **useThemeToken**(): `GlobalToken`

Read the current Ant Design theme token.

## Returns

`GlobalToken`

Ant Design global token object for the active theme.

## Example

```tsx
import { useThemeToken } from '@faasjs/ant-design'

function PrimarySwatch() {
  const { colorPrimary } = useThemeToken()

  return <div style={{ width: 24, height: 24, background: colorPrimary }} />
}
```
