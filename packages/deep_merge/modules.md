# @faasjs/deep_merge

## Table of contents

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

#### Defined in

[index.ts:15](https://github.com/faasjs/faasjs/blob/1705fd2/packages/deep_merge/src/index.ts#L15)
