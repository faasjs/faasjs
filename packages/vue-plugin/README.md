# @faasjs/vue-plugin

[![License: MIT](https://img.shields.io/npm/l/@faasjs/vue-plugin.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/vue-plugin/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/vue-plugin/stable.svg)](https://www.npmjs.com/package/@faasjs/vue-plugin)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/vue-plugin/beta.svg)](https://www.npmjs.com/package/@faasjs/vue-plugin)

A Vue plugin for FaasJS.

## Install

    npm install @faasjs/vue-plugin

## Modules

### Classes

- [FaasBrowserClient](classes/FaasBrowserClient.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

### Type Aliases

- [FaasVuePluginOptions](#faasvuepluginoptions)
- [Options](#options)
- [ResponseHeaders](#responseheaders)

### Variables

- [FaasVuePlugin](#faasvueplugin)

## Type Aliases

### FaasVuePluginOptions

Ƭ **FaasVuePluginOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `domain` | `string` |
| `options?` | [`Options`](#options) |

___

### Options

Ƭ **Options**: `RequestInit` & \{ `beforeRequest?`: (`{
    action,
    params,
    options,
  }`: \{ `action`: `string` ; `options`: [`Options`](#options) ; `params`: `Record`\<`string`, `any`\>  }) => `Promise`\<`void`\> ; `headers?`: \{ `[key: string]`: `string`;  } ; `request?`: \<PathOrData\>(`url`: `string`, `options`: [`Options`](#options)) => `Promise`\<[`Response`](classes/Response.md)\<`FaasData`\<`PathOrData`\>\>\>  }

___

### ResponseHeaders

Ƭ **ResponseHeaders**: `Object`

#### Index signature

▪ [key: `string`]: `string`

## Variables

### FaasVuePlugin

• `Const` **FaasVuePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`app`: `any`, `options`: [`FaasVuePluginOptions`](#faasvuepluginoptions)) => `void` |
