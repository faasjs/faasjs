[@faasjs/ant-design](../README.md) / transferOptions

# Function: transferOptions()

> **transferOptions**(`options`): `object`[]

Normalize primitive options into explicit `{ label, value }` objects.

String and number options are converted with [idToTitle](idToTitle.md), while pre-shaped option objects
are returned as-is.

## Parameters

### options

[`BaseOption`](../type-aliases/BaseOption.md)[]

Raw option list to normalize.

## Returns

`object`[]

Normalized option list.

## Example

```ts
import { transferOptions } from '@faasjs/ant-design'

transferOptions(['draft', { label: 'Published', value: 'published' }])
// [
//   { label: 'Draft', value: 'draft' },
//   { label: 'Published', value: 'published' },
// ]
```
