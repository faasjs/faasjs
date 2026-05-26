[@faasjs/ant-design](../README.md) / transferValue

# Function: transferValue()

> **transferValue**(`type`, `value`): `any`

Coerce a raw value into the expected JavaScript type for a given [FaasItemType](../type-aliases/FaasItemType.md).

Falsy scalar values (including the strings `"null"` and `"undefined"`) are normalised to `null`.
Array-typed values are coerced element-by-element. Date/time values are parsed into Dayjs objects
and unix timestamps are auto-detected.

## Parameters

### type

[`FaasItemType`](../type-aliases/FaasItemType.md) \| `null` \| `undefined`

Target item type (defaults to `"string"` when falsy).

### value

`any`

Raw value to normalise.

## Returns

`any`

Normalised value matching the expected type.
