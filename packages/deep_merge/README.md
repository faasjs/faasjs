# @faasjs/deep_merge

[![License: MIT](https://img.shields.io/npm/l/@faasjs/deep_merge.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/deep_merge/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/deep_merge/stable.svg)](https://www.npmjs.com/package/@faasjs/deep_merge)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/deep_merge/beta.svg)](https://www.npmjs.com/package/@faasjs/deep_merge)

A helper function to deep merge objects and array.

## Install

    npm install @faasjs/deep_merge

## Modules

### Functions

- [deepMerge](#deepmerge)

## Functions

### deepMerge

▸ **deepMerge**(`...sources`): `any`

Deep merge two objects or arrays.

Features:
* All objects will be cloned before merging.
* Merging order is from right to left.
* If an array include same objects, it will be unique to one.

```ts
deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
deepMerge([1, 2], [2, 3]) // [1, 2, 3]
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `...sources` | `any`[] |

#### Returns

`any`
