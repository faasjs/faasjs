# @faasjs/vue-plugin

Vue 插件

[![License: MIT](https://img.shields.io/npm/l/@faasjs/vue-plugin.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/vue-plugin/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/vue-plugin/stable.svg)](https://www.npmjs.com/package/@faasjs/vue-plugin)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/vue-plugin/beta.svg)](https://www.npmjs.com/package/@faasjs/vue-plugin)

https://faasjs.com/guide/excel/vue.html

## Modules

### Classes

- [FaasBrowserClient](classes/FaasBrowserClient.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

### Interfaces

- [FaasVuePluginOptions](interfaces/FaasVuePluginOptions.md)

### Type aliases

- [Options](modules.md#options)
- [ResponseHeaders](modules.md#responseheaders)

### Variables

- [FaasVuePlugin](modules.md#faasvueplugin)

## Type aliases

### Options

Ƭ **Options**: `RequestInit` & { `headers?`: { [key: string]: `string`;  } ; `beforeRequest?`: (`__namedParameters`: { `action`: `string` ; `options`: [`Options`](modules.md#options) ; `params`: `Record`<`string`, `any`\>  }) => `void` \| `Promise`<`void`\>  }

___

### ResponseHeaders

Ƭ **ResponseHeaders**: `Object`

#### Index signature

▪ [key: `string`]: `string`

## Variables

### FaasVuePlugin

• **FaasVuePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`Vue`: `any`, `options`: [`FaasVuePluginOptions`](interfaces/FaasVuePluginOptions.md)) => `void` |
