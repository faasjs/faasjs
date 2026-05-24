[@faasjs/ant-design](../README.md) / DescriptionWithoutFaasProps

# Interface: DescriptionWithoutFaasProps\<T, ExtendItemProps\>

Props for [Description](../functions/Description.md) when used with a local `dataSource`.

## Example

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

## Extends

- `DescriptionCommonProps`\<`T`, `ExtendItemProps`\>

## Type Parameters

### T

`T` = `any`

Data record shape rendered by the component.

### ExtendItemProps

`ExtendItemProps` = `any`

Additional item prop shape accepted by `items`.

## Methods

### renderTitle()?

> `optional` **renderTitle**(`this`, `values`): `ReactNode`

Callback used to derive the rendered title from the current record.

#### Parameters

##### this

`void`

##### values

`T`

#### Returns

`ReactNode`

#### Inherited from

`DescriptionCommonProps.renderTitle`

## Properties

### dataSource?

> `optional` **dataSource?**: `T`

Local data record rendered directly by the component.

### extendTypes?

> `optional` **extendTypes?**: `object`

Custom type renderers keyed by item type.

#### Index Signature

\[`key`: `string`\]: [`ExtendDescriptionTypeProps`](ExtendDescriptionTypeProps.md)\<`any`\>

#### Inherited from

`DescriptionCommonProps.extendTypes`

### faasData?

> `optional` **faasData?**: `undefined`

### items

> **items**: (`ExtendItemProps` \| [`DescriptionItemProps`](DescriptionItemProps.md)\<`any`\>)[]

Description item definitions rendered by the component.

#### Inherited from

`DescriptionCommonProps.items`
