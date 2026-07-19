[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / Description

# Function: Description()

## Call Signature

> **Description**\<`T`>>>>\>(`props`): `Element`

Render an Ant Design description list from a local data source.

The component applies FaasJS item type normalization helpers to render item metadata with
appropriate display formatting.

### Type Parameters

#### T

`T` _extends_ `Record`\<`string`, `any`\> = `any`

Data record shape rendered by the component.

### Parameters

#### props

[`DescriptionWithoutFaasProps`](../interfaces/DescriptionWithoutFaasProps.md)\<`T`\>

Description props including items and a local data source.

### Returns

`Element`

### Example

```tsx
import { Description } from '@faasjs/ant-design'

export function Detail() {
  return (
    <Description
      title="Title"
      items={[{ id: 'id', title: 'Title', type: 'string' }]}
      dataSource={{ id: 'value' }}
    />
  )
}
```

## Call Signature

> **Description**\<`Path`, `T`>>>>\>(`props`): `Element`

Render an Ant Design description list with fetched FaasJS data.

The component fetches data via `faasData` and applies FaasJS item type normalization helpers
to render item metadata with appropriate display formatting.

When `Path` is provided, the `action` and `params` in `faasData` are strongly typed from the
`FaasActions` type augmentation.

### Type Parameters

#### Path

`Path` _extends_ `FaasActionPaths`

Action path type inferred from `faasData.action` for strong typing.

#### T

`T` _extends_ `Record`\<`string`, `any`\> = `any`

Data record shape rendered by the component.

### Parameters

#### props

[`DescriptionWithFaasProps`](../interfaces/DescriptionWithFaasProps.md)\<`Path`, `T`\>

Description props including items and FaasJS data config.

### Returns

`Element`

### Example

```tsx
import { Description } from '@faasjs/ant-design'

export function Detail() {
  return (
    <Description
      title="Title"
      items={[{ id: 'id', title: 'Title', type: 'string' }]}
      faasData={{
        action: 'user/get',
        params: { id: 1 },
      }}
    />
  )
}
```

## Call Signature

> **Description**\<`T`>>>>\>(`props`): `Element`

Render an Ant Design description list (catch-all overload for backward compatibility).

### Type Parameters

#### T

`T` _extends_ `Record`\<`string`, `any`\> = `any`

### Parameters

#### props

[`DescriptionProps`](../type-aliases/DescriptionProps.md)\<`T`\>

### Returns

`Element`
