[@faasjs/ant-design](../README.md) / ConfigProvider

# Function: ConfigProvider()

> **ConfigProvider**(`props`): `Element` \| `null`

Config for `@faasjs/ant-design` components.

## Parameters

### props

[`ConfigProviderProps`](../interfaces/ConfigProviderProps.md)

## Returns

`Element` \| `null`

## Example

```tsx
import { ConfigProvider } from '@faasjs/ant-design'

<ConfigProvider theme={{ common: { blank: 'Empty' } }}>
  <Blank />
</ConfigProvider>
```
