# @faasjs/vue-plugin

## Table of contents

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

#### Defined in

[browser/src/index.ts:5](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L5)

___

### ResponseHeaders

Ƭ **ResponseHeaders**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[browser/src/index.ts:18](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L18)

## Variables

### FaasVuePlugin

• **FaasVuePlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `install` | (`Vue`: `any`, `options`: [`FaasVuePluginOptions`](interfaces/FaasVuePluginOptions.md)) => `void` |

#### Defined in

[vue-plugin/src/index.ts:12](https://github.com/faasjs/faasjs/blob/1705fd2/packages/vue-plugin/src/index.ts#L12)
