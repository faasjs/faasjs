[@faasjs/node-utils](../README.md) / deepMerge

# Function: deepMerge()

> **deepMerge**(...`sources`): `any`

Deep merge two objects or arrays.

Features:

- All objects will be cloned before merging.
- Merging order is from right to left.
- If an array include same objects, it will be unique to one.

## Parameters

### sources

...`any`[]

## Returns

`any`

## Example

```ts
import { deepMerge } from '@faasjs/node-utils'

deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
deepMerge([1, 2], [2, 3]) // [1, 2, 3]
```
