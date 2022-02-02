# @faasjs/deep_merge

合并对象

[![License: MIT](https://img.shields.io/npm/l/@faasjs/deep_merge.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/deep_merge/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/deep_merge/stable.svg)](https://www.npmjs.com/package/@faasjs/deep_merge)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/deep_merge/beta.svg)](https://www.npmjs.com/package/@faasjs/deep_merge)

## Modules

### Functions

- [deepMerge](modules.md#deepmerge)

## Functions

### deepMerge

▸ **deepMerge**(...`sources`): `any`

合并对象

**`description`**
注意事项：
* 合并时会复制对象，不会修改原对象
* 合并顺序是后面的覆盖前面的
* 若有数组形式的属性，数组里的内容将被去重合并

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...sources` | `any`[] | 合并对象 |

#### Returns

`any`
