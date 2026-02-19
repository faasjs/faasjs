[@faasjs/ant-design](../README.md) / Description

# Function: Description()

> **Description**\<`T`\>(`__namedParameters`): `Element`

Description component

- Based on [Ant Design Descriptions](https://ant.design/components/descriptions/).

## Type Parameters

### T

`T` _extends_ `Record`\<`string`, `any`\> = `any`

## Parameters

### \_\_namedParameters

[`DescriptionProps`](../interfaces/DescriptionProps.md)\<`T`\>

## Returns

`Element`

## Example

```tsx
import { Description } from '@faasjs/ant-design'
;<Description
  title='Title'
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
