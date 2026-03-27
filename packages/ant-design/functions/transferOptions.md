[@faasjs/ant-design](../README.md) / transferOptions

# Function: transferOptions()

> **transferOptions**(`options`): `object`[]

convert string[] or number[] to { label, value }[]

## Parameters

### options

[`BaseOption`](../type-aliases/BaseOption.md)[]

## Returns

`object`[]

## Example

```ts
import { transferOptions } from '@faasjs/ant-design'

transferOptions(['draft', { label: 'Published', value: 'published' }])
// [
//   { label: 'Draft', value: 'draft' },
//   { label: 'Published', value: 'published' },
// ]
```
