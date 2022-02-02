# @faasjs/types

Type definitions.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/types.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/types/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/types/stable.svg)](https://www.npmjs.com/package/@faasjs/types)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/types/beta.svg)](https://www.npmjs.com/package/@faasjs/types)

https://faasjs.com/doc/types.html

## Modules

### Type aliases

- [FaasAction](modules.md#faasaction)
- [FaasActionPaths](modules.md#faasactionpaths)
- [FaasData](modules.md#faasdata)
- [FaasParams](modules.md#faasparams)

## Type aliases

### FaasAction

Ƭ **FaasAction**: [`FaasActionPaths`](modules.md#faasactionpaths) \| `Record`<`string`, `any`\>

___

### FaasActionPaths

Ƭ **FaasActionPaths**: keyof `FaasActions`

___

### FaasData

Ƭ **FaasData**<`T`\>: `T` extends [`FaasActionPaths`](modules.md#faasactionpaths) ? `FaasActions`[`T`][``"Data"``] : `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### FaasParams

Ƭ **FaasParams**<`T`\>: `T` extends [`FaasActionPaths`](modules.md#faasactionpaths) ? `FaasActions`[`T`][``"Params"``] : `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
