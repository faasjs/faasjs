[@faasjs/deep_merge](../README.md) / deepMerge

# Function: deepMerge()

> **deepMerge**(...`sources`): `any`

Deep merge two objects or arrays.

Features:
* All objects will be cloned before merging.
* Merging order is from right to left.
* If an array include same objects, it will be unique to one.

```ts
deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
deepMerge([1, 2], [2, 3]) // [1, 2, 3]
```

## Parameters

• ...**sources**: `any`[]

## Returns

`any`
