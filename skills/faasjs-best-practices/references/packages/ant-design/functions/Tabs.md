[@faasjs/ant-design](../README.md) / Tabs

# Function: Tabs()

> **Tabs**(`props`): `Element`

Render an Ant Design tabs wrapper that accepts FaasJS-style tab definitions.

Missing `key` and `label` values are derived from each tab's `id` and `title`.

## Parameters

### props

[`TabsProps`](../interfaces/TabsProps.md)

Tabs props including tab items and Ant Design tab options.

## Returns

`Element`

## Example

```tsx
import { Tabs } from '@faasjs/ant-design'

export function Page() {
  return (
    <Tabs
      items={[
        {
          id: 'id',
          children: 'content',
        },
        1 === 0 && {
          id: 'hidden',
          children: 'content',
        },
      ]}
    />
  )
}
```
