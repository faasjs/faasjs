# @faasjs/types

## Table of contents

### Type aliases

- [FaasAction](modules.md#faasaction)
- [FaasActionPaths](modules.md#faasactionpaths)
- [FaasData](modules.md#faasdata)
- [FaasParams](modules.md#faasparams)

## Type aliases

### FaasAction

Ƭ **FaasAction**: [`FaasActionPaths`](modules.md#faasactionpaths) \| `Record`<`string`, `any`\>

#### Defined in

[index.ts:6](https://github.com/faasjs/faasjs/blob/1705fd2/packages/types/src/index.ts#L6)

___

### FaasActionPaths

Ƭ **FaasActionPaths**: keyof `FaasActions`

#### Defined in

[index.ts:4](https://github.com/faasjs/faasjs/blob/1705fd2/packages/types/src/index.ts#L4)

___

### FaasData

Ƭ **FaasData**<`T`\>: `T` extends [`FaasActionPaths`](modules.md#faasactionpaths) ? `FaasActions`[`T`][``"Data"``] : `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Defined in

[index.ts:8](https://github.com/faasjs/faasjs/blob/1705fd2/packages/types/src/index.ts#L8)

___

### FaasParams

Ƭ **FaasParams**<`T`\>: `T` extends [`FaasActionPaths`](modules.md#faasactionpaths) ? `FaasActions`[`T`][``"Params"``] : `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Defined in

[index.ts:7](https://github.com/faasjs/faasjs/blob/1705fd2/packages/types/src/index.ts#L7)
