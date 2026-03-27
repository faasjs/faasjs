[@faasjs/ant-design](../README.md) / Description

# Function: Description()

> **Description**\<`T`\>(`props`): `Element`

Description component

- Based on [Ant Design Descriptions](https://ant.design/components/descriptions/).

## Type Parameters

### T

`T` _extends_ `Record`\<`string`, `any`\> = `any`

Data record shape rendered by the component.

## Parameters

### props

[`DescriptionProps`](../interfaces/DescriptionProps.md)\<`T`\>

Description props including items, data source, and optional Faas data config.

## Returns

`Element`

## Example

```tsx
import { Description } from '@faasjs/ant-design'
;<Description
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
