# @faasjs/react

[![License: MIT](https://img.shields.io/npm/l/@faasjs/react.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/react/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/react/stable.svg)](https://www.npmjs.com/package/@faasjs/react)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/react/beta.svg)](https://www.npmjs.com/package/@faasjs/react)

React plugin for FaasJS.

**If you use [SWR](https://swr.vercel.app) or [React Query / TanStack Query](https://tanstack.com/query), please use [`@faasjs/browser`](https://faasjs.com/doc/browser) directly.**

## Install

    npm install @faasjs/react

## Modules

### Classes

- [FaasBrowserClient](classes/FaasBrowserClient.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

### Interfaces

- [FaasDataInjection](interfaces/FaasDataInjection.md)
- [FaasDataWrapperProps](interfaces/FaasDataWrapperProps.md)
- [FaasReactClientInstance](interfaces/FaasReactClientInstance.md)

### Type Aliases

- [FaasAction](#faasaction)
- [FaasData](#faasdata)
- [FaasParams](#faasparams)
- [Options](#options)
- [ResponseHeaders](#responseheaders)

### Functions

- [FaasDataWrapper](#faasdatawrapper)
- [FaasReactClient](#faasreactclient)
- [faas](#faas)
- [getClient](#getclient)
- [useFaas](#usefaas)

## Type Aliases

### FaasAction

Ƭ **FaasAction**: `FaasActionPaths` \| `Record`<`string`, `any`\>

___

### FaasData

Ƭ **FaasData**<`T`\>: `T` extends `FaasActionPaths` ? `FaasActions`[`T`][``"Data"``] : `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### FaasParams

Ƭ **FaasParams**<`T`\>: `T` extends `FaasActionPaths` ? `FaasActions`[`T`][``"Params"``] : `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### Options

Ƭ **Options**: `RequestInit` & { `beforeRequest?`: (`{
    action, params, options
  }`: { `action`: `string` ; `options`: [`Options`](#options) ; `params`: `Record`<`string`, `any`\>  }) => `Promise`<`void`\> \| `void` ; `headers?`: { `[key: string]`: `string`;  } ; `request?`: <PathOrData\>(`url`: `string`, `options`: [`Options`](#options)) => `Promise`<[`Response`](classes/Response.md)<[`FaasData`](#faasdata)<`PathOrData`\>\>\>  }

___

### ResponseHeaders

Ƭ **ResponseHeaders**: `Object`

#### Index signature

▪ [key: `string`]: `string`

## Functions

### FaasDataWrapper

▸ **FaasDataWrapper**<`PathOrData`\>(`props`): `JSX.Element`

A data wrapper for react components

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FaasDataWrapperProps`](interfaces/FaasDataWrapperProps.md)<`PathOrData`\> |

#### Returns

`JSX.Element`

```ts
<FaasDataWrapper<{
  id: string
  title: string
}>
  action='post/get'
  params={ { id: 1 } }
  render={ ({ data }) => <h1>{ data.title }</h1> }
/>
```

___

### FaasReactClient

▸ **FaasReactClient**(`«destructured»`): [`FaasReactClientInstance`](interfaces/FaasReactClientInstance.md)

Before use faas, you should initialize a FaasReactClient.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `domain` | `string` |
| › `onError?` | (`action`: `string`, `params`: `Record`<`string`, `any`\>) => (`res`: [`ResponseError`](classes/ResponseError.md)) => `Promise`<`void`\> |
| › `options?` | [`Options`](#options) |

#### Returns

[`FaasReactClientInstance`](interfaces/FaasReactClientInstance.md)

```ts
const client = FaasReactClient({
  domain: 'localhost:8080/api'
})
```

___

### faas

▸ **faas**<`PathOrData`\>(`action`, `params`): `Promise`<[`Response`](classes/Response.md)<[`FaasData`](#faasdata)<`PathOrData`\>\>\>

Request faas server

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | {string} action name |
| `params` | [`FaasParams`](#faasparams)<`PathOrData`\> | {object} action params |

#### Returns

`Promise`<[`Response`](classes/Response.md)<[`FaasData`](#faasdata)<`PathOrData`\>\>\>

```ts
faas<{ title: string }>('post/get', { id: 1 }).then(res => {
  console.log(res.data.title)
})
```

___

### getClient

▸ **getClient**(`domain?`): [`FaasReactClientInstance`](interfaces/FaasReactClientInstance.md)

Get FaasReactClient instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `domain?` | `string` | {string} empty string for default domain |

#### Returns

[`FaasReactClientInstance`](interfaces/FaasReactClientInstance.md)

```ts
getClient()
// or
getClient('another-domain')
```

___

### useFaas

▸ **useFaas**<`PathOrData`\>(`action`, `defaultParams`, `options?`): [`FaasDataInjection`](interfaces/FaasDataInjection.md)<[`FaasData`](#faasdata)<`PathOrData`\>\>

Request faas server with React hook

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | {string} action name |
| `defaultParams` | [`FaasParams`](#faasparams)<`PathOrData`\> | {object} initial action params |
| `options?` | `Object` | - |
| `options.data?` | [`FaasData`](#faasdata)<`PathOrData`\> | - |
| `options.setData?` | `Dispatch`<`SetStateAction`<[`FaasData`](#faasdata)<`PathOrData`\>\>\> | - |
| `options.skip?` | `boolean` | - |

#### Returns

[`FaasDataInjection`](interfaces/FaasDataInjection.md)<[`FaasData`](#faasdata)<`PathOrData`\>\>

```ts
function Post ({ id }) {
  const { data } = useFaas<{ title: string }>('post/get', { id })
  return <h1>{data.title}</h1>
}
```
