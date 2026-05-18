[@faasjs/ant-design](../README.md) / Description

# Function: Description()

> **Description**\<`T`\>(`props`): `Element`

Render an Ant Design description list from FaasJS item metadata.

The component can render a local `dataSource` directly or resolve one through `faasData`, and
it applies the same item type normalization helpers used by the form and table components.

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

## Throws

When an entry in `extendTypes` omits both `children` and `render`.

## Example

```tsx
import { Description } from '@faasjs/ant-design'

export function Detail() {
  return (
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
  )
}
```
