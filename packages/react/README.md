# @faasjs/react

[![License: MIT](https://img.shields.io/npm/l/@faasjs/react.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/react/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/react/stable.svg)](https://www.npmjs.com/package/@faasjs/react)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/react/beta.svg)](https://www.npmjs.com/package/@faasjs/react)

React plugin for FaasJS.

**If you use [SWR](https://swr.vercel.app) or [React Query / TanStack Query](https://tanstack.com/query), please use [`@faasjs/browser`](https://faasjs.com/doc/browser) directly.**

## Install

    npm install @faasjs/react react react-dom

## Modules

### Classes

- [ErrorBoundary](classes/ErrorBoundary.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

### Interfaces

- [ErrorBoundaryProps](interfaces/ErrorBoundaryProps.md)

### Type Aliases

- [ErrorChildrenProps](#errorchildrenprops)
- [FaasAction](#faasaction)
- [FaasData](#faasdata)
- [FaasDataInjection](#faasdatainjection)
- [FaasDataWrapperProps](#faasdatawrapperprops)
- [FaasParams](#faasparams)
- [FaasReactClientInstance](#faasreactclientinstance)
- [Options](#options)
- [ResponseHeaders](#responseheaders)
- [useFaasOptions](#usefaasoptions)

### Functions

- [FaasDataWrapper](#faasdatawrapper)
- [FaasReactClient](#faasreactclient)
- [faas](#faas)
- [getClient](#getclient)
- [useFaas](#usefaas)

## Type Aliases

### ErrorChildrenProps

Ƭ **ErrorChildrenProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error?` | `Error` |
| `errorDescription?` | `string` |
| `errorMessage?` | `string` |
| `info?` | `any` |

___

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

### FaasDataInjection

Ƭ **FaasDataInjection**<`Data`\>: `Object`

Injects FaasData props.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Data` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `action` | `string` \| `any` |
| `data` | `Data` |
| `error` | `any` |
| `loading` | `boolean` |
| `params` | `Record`<`string`, `any`\> |
| `promise` | `Promise`<`Response`<`Data`\>\> |
| `reloadTimes` | `number` |
| `setData` | `React.Dispatch`<`React.SetStateAction`<`Data`\>\> |
| `setError` | `React.Dispatch`<`React.SetStateAction`<`any`\>\> |
| `setLoading` | `React.Dispatch`<`React.SetStateAction`<`boolean`\>\> |
| `setPromise` | `React.Dispatch`<`React.SetStateAction`<`Promise`<`Response`<`Data`\>\>\>\> |
| `reload` | (`params?`: `Record`<`string`, `any`\>) => `Promise`<`any`\> |

___

### FaasDataWrapperProps

Ƭ **FaasDataWrapperProps**<`PathOrData`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `FaasAction` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` | - |
| `children?` | `React.ReactElement`<`Partial`<[`FaasDataInjection`](#faasdatainjection)\>\> | - |
| `data?` | `FaasData`<`PathOrData`\> | use custom data, should work with setData |
| `fallback?` | `JSX.Element` \| ``false`` | - |
| `params?` | `FaasParams`<`PathOrData`\> | - |
| `setData?` | `React.Dispatch`<`React.SetStateAction`<`FaasData`<`PathOrData`\>\>\> | use custom setData, should work with data |
| `onDataChange?` | (`args`: [`FaasDataInjection`](#faasdatainjection)<`FaasData`<`PathOrData`\>\>) => `void` | - |
| `render?` | (`args`: [`FaasDataInjection`](#faasdatainjection)<`FaasData`<`PathOrData`\>\>) => `Element` \| `Element`[] | - |

___

### FaasParams

Ƭ **FaasParams**<`T`\>: `T` extends `FaasActionPaths` ? `FaasActions`[`T`][``"Params"``] : `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

___

### FaasReactClientInstance

Ƭ **FaasReactClientInstance**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `faas` | <PathOrData\>(`action`: `string` \| `PathOrData`, `params`: `FaasParams`<`PathOrData`\>) => `Promise`<`Response`<`FaasData`<`PathOrData`\>\>\> |
| `id` | `string` |
| `useFaas` | <PathOrData\>(`action`: `string` \| `PathOrData`, `defaultParams`: `FaasParams`<`PathOrData`\>, `options?`: [`useFaasOptions`](#usefaasoptions)<`PathOrData`\>) => [`FaasDataInjection`](#faasdatainjection)<`FaasData`<`PathOrData`\>\> |
| `FaasDataWrapper` | <PathOrData\>(`props`: [`FaasDataWrapperProps`](#faasdatawrapperprops)<`PathOrData`\>) => `Element` |

___

### Options

Ƭ **Options**: `RequestInit` & { `beforeRequest?`: (`{
    action,
    params,
    options,
  }`: { `action`: `string` ; `options`: [`Options`](#options) ; `params`: `Record`<`string`, `any`\>  }) => `Promise`<`void`\> \| `void` ; `headers?`: { `[key: string]`: `string`;  } ; `request?`: <PathOrData\>(`url`: `string`, `options`: [`Options`](#options)) => `Promise`<[`Response`](classes/Response.md)<[`FaasData`](#faasdata)<`PathOrData`\>\>\>  }

___

### ResponseHeaders

Ƭ **ResponseHeaders**: `Object`

#### Index signature

▪ [key: `string`]: `string`

___

### useFaasOptions

Ƭ **useFaasOptions**<`PathOrData`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `FaasAction` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `FaasData`<`PathOrData`\> | - |
| `debounce?` | `number` | send the last request after milliseconds |
| `params?` | `FaasParams`<`PathOrData`\> | - |
| `setData?` | `React.Dispatch`<`React.SetStateAction`<`FaasData`<`PathOrData`\>\>\> | - |
| `skip?` | `boolean` | - |

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
| `props` | [`FaasDataWrapperProps`](#faasdatawrapperprops)<`PathOrData`\> |

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

▸ **FaasReactClient**(`«destructured»`): [`FaasReactClientInstance`](#faasreactclientinstance)

Before use faas, you should initialize a FaasReactClient.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `domain` | `string` |
| › `onError?` | (`action`: `string`, `params`: `Record`<`string`, `any`\>) => (`res`: [`ResponseError`](classes/ResponseError.md)) => `Promise`<`void`\> |
| › `options?` | [`Options`](#options) |

#### Returns

[`FaasReactClientInstance`](#faasreactclientinstance)

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

▸ **getClient**(`domain?`): [`FaasReactClientInstance`](#faasreactclientinstance)

Get FaasReactClient instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `domain?` | `string` | {string} empty string for default domain |

#### Returns

[`FaasReactClientInstance`](#faasreactclientinstance)

```ts
getClient()
// or
getClient('another-domain')
```

___

### useFaas

▸ **useFaas**<`PathOrData`\>(`action`, `defaultParams`, `options?`): [`FaasDataInjection`](#faasdatainjection)<[`FaasData`](#faasdata)<`PathOrData`\>\>

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
| `options?` | [`useFaasOptions`](#usefaasoptions)<`PathOrData`\> | - |

#### Returns

[`FaasDataInjection`](#faasdatainjection)<[`FaasData`](#faasdata)<`PathOrData`\>\>

```ts
function Post ({ id }) {
  const { data } = useFaas<{ title: string }>('post/get', { id })
  return <h1>{data.title}</h1>
}
```
