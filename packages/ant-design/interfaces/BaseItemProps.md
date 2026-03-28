[@faasjs/ant-design](../README.md) / BaseItemProps

# Interface: BaseItemProps

Common metadata shared by form, table, and description items.

## Extended by

- [`FaasItemProps`](FaasItemProps.md)
- [`FormItemProps`](FormItemProps.md)

## Properties

### id

> **id**: `string` \| `number`

Stable field identifier used as the default name and title source.

### options?

> `optional` **options?**: [`BaseOption`](../type-aliases/BaseOption.md)[]

Shared choice options used by select-like renderers.

### title?

> `optional` **title?**: `string`

Human-readable title used for labels and table headers.
