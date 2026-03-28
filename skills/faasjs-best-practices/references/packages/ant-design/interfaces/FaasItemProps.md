[@faasjs/ant-design](../README.md) / FaasItemProps

# Interface: FaasItemProps

Base item props plus the shared built-in value type selector.

## Extends

- [`BaseItemProps`](BaseItemProps.md)

## Extended by

- [`DescriptionItemProps`](DescriptionItemProps.md)
- [`TableItemProps`](TableItemProps.md)

## Properties

### id

> **id**: `string` \| `number`

Stable field identifier used as the default name and title source.

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`id`](BaseItemProps.md#id)

### options?

> `optional` **options?**: [`BaseOption`](../type-aliases/BaseOption.md)[]

Shared choice options used by select-like renderers.

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`options`](BaseItemProps.md#options)

### title?

> `optional` **title?**: `string`

Human-readable title used for labels and table headers.

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`title`](BaseItemProps.md#title)

### type?

> `optional` **type?**: [`FaasItemType`](../type-aliases/FaasItemType.md)

Built-in FaasJS field type used to normalize and render values.

#### Default

```ts
'string'
```
