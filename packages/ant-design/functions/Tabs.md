[@faasjs/ant-design](../README.md) / Tabs

# Function: Tabs()

> **Tabs**(`props`): `Element`

Tabs component with Ant Design & FaasJS

- Based on [Ant Design Tabs](https://ant.design/components/tabs/).
- Support auto skip null/false tab item.
- Support `id` as key and label.

## Parameters

• **props**: [`TabsProps`](../interfaces/TabsProps.md)

## Returns

`Element`

## Example

```tsx
import { Tabs } from '@faasjs/ant-design'

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
```
