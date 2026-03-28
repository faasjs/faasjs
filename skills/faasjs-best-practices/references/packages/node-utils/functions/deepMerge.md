[@faasjs/node-utils](../README.md) / deepMerge

# Function: deepMerge()

> **deepMerge**(...`sources`): `any`

Deeply clone and merge plain objects or arrays.

Later sources override earlier object properties, and nested objects are merged recursively.
Array values are deduplicated with `Set`, with items from newer sources appearing first.
Non-object and non-array inputs are ignored.

## Parameters

### sources

...`any`[]

Objects or arrays to merge from left to right.

## Returns

`any`

A cloned merged value built from the provided sources.

## Example

```ts
import { deepMerge } from '@faasjs/node-utils'

deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
deepMerge({ a: [0] }, { a: [1] }) // { a: [1, 0] }
```
