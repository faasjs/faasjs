[@faasjs/ant-design](../README.md) / Description

# Function: Description()

> **Description**\<`T`\>(`props`): `Element`

Description component

- Based on [Ant Design Descriptions](https://ant.design/components/descriptions/).

## Type parameters

• **T** = `any`

## Parameters

• **props**: [`DescriptionProps`](../interfaces/DescriptionProps.md)\<`T`, `any`\>

## Returns

`Element`

## Example

```tsx
import { Description } from '@faasjs/ant-design'

<Description
  title="Title"
  items={[
    {
      id: 'id',
      title: 'Title',
      type: 'string',
    },
  ]}
  dataSource={{ id: 'value' }}
/>
```
