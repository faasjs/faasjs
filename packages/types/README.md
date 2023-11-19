# @faasjs/types

[![License: MIT](https://img.shields.io/npm/l/@faasjs/types.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/types/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/types/stable.svg)](https://www.npmjs.com/package/@faasjs/types)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/types/beta.svg)](https://www.npmjs.com/package/@faasjs/types)

Type definitions.

## Install

    npm install @faasjs/types

## Modules

### Type Aliases

- [FaasAction](#faasaction)
- [FaasActionPaths](#faasactionpaths)
- [FaasData](#faasdata)
- [FaasParams](#faasparams)

## Type Aliases

### FaasAction

Ƭ **FaasAction**: [`FaasActionPaths`](#faasactionpaths) \| `Record`\<`string`, `any`\>

___

### FaasActionPaths

Ƭ **FaasActionPaths**: keyof `FaasActions`

___

### FaasData

Ƭ **FaasData**\<`T`\>: `T` extends [`FaasActionPaths`](#faasactionpaths) ? `FaasActions`[`T`][``"Data"``] : `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### FaasParams

Ƭ **FaasParams**\<`T`\>: `T` extends [`FaasActionPaths`](#faasactionpaths) ? `FaasActions`[`T`][``"Params"``] : `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
