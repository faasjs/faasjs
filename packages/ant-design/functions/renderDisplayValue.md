[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / renderDisplayValue

# Function: renderDisplayValue()

> **renderDisplayValue**(`type`, `value`, `options?`): `string` \| `number` \| `boolean` \| `Element` \| `null`

Render a display value using FaasJS item-type-aware formatting.

Arrays are joined by comma, booleans render as icons, date/time values are formatted,
and option-backed values resolve the corresponding label before rendering. Empty values
produce a [Blank](Blank.md) placeholder.

## Parameters

### type

[`FaasItemType`](../type-aliases/FaasItemType.md)

Item type that controls the formatting logic.

### value

`any`

Raw value to display.

### options?

`object`[]

Optional list of options used for label resolution.

## Returns

`string` \| `number` \| `boolean` \| `Element` \| `null`

React node representing the formatted display value.
