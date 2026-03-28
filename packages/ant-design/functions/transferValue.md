[@faasjs/ant-design](../README.md) / transferValue

# Function: transferValue()

> **transferValue**(`type`, `value`): `any`

Normalize raw values into the runtime shape expected by FaasJS Ant Design components.

Primitive strings such as `'null'` and `'undefined'` become `null`, comma-delimited array
strings are split into arrays, and date or time values are converted to `dayjs` objects.

## Parameters

### type

[`FaasItemType`](../type-aliases/FaasItemType.md) \| `null` \| `undefined`

Target field type.

### value

`any`

Raw value to normalize.

## Returns

`any`

Normalized value for rendering or form initialization.

## Example

```ts
import { transferValue } from '@faasjs/ant-design'

transferValue('number', '42') // 42
transferValue('boolean', 'true') // true
transferValue('string[]', 'a,b') // ['a', 'b']
```
