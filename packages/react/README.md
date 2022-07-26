# @faasjs/react

[![License: MIT](https://img.shields.io/npm/l/@faasjs/react.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/react/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/react/stable.svg)](https://www.npmjs.com/package/@faasjs/react)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/react/beta.svg)](https://www.npmjs.com/package/@faasjs/react)

React plugin for FaasJS.

## Install

    npm install @faasjs/react

## Modules

### Classes

- [FaasBrowserClient](classes/FaasBrowserClient.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

### Type Aliases

- [FaasDataInjection](#faasdatainjection)
- [FaasDataWrapperProps](#faasdatawrapperprops)
- [FaasReactClientInstance](#faasreactclientinstance)
- [Options](#options)
- [ResponseHeaders](#responseheaders)

### Functions

- [FaasDataWrapper](#faasdatawrapper)
- [FaasReactClient](#faasreactclient)
- [faas](#faas)
- [getClient](#getclient)
- [useFaas](#usefaas)

## Type Aliases

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
| `promise` | `Promise`<[`Response`](classes/Response.md)<`Data`\>\> |
| `setData` | `React.Dispatch`<`React.SetStateAction`<`Data`\>\> |
| `setError` | `React.Dispatch`<`React.SetStateAction`<`any`\>\> |
| `setLoading` | `React.Dispatch`<`React.SetStateAction`<`boolean`\>\> |
| `setPromise` | `React.Dispatch`<`React.SetStateAction`<`Promise`<[`Response`](classes/Response.md)<`Data`\>\>\>\> |
| `reload` | (`params?`: `Record`<`string`, `any`\>) => `Promise`<[`Response`](classes/Response.md)<`Data`\>\> |

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
| `data?` | `FaasData`<`PathOrData`\> | use custom data, should work with setData |
| `fallback?` | `JSX.Element` \| ``false`` | - |
| `params?` | `FaasParams`<`PathOrData`\> | - |
| `setData?` | `React.Dispatch`<`React.SetStateAction`<`FaasData`<`PathOrData`\>\>\> | use custom setData, should work with data |
| `onDataChange?` | (`args`: [`FaasDataInjection`](#faasdatainjection)<`FaasData`<`PathOrData`\>\>) => `void` | - |
| `render?` | (`args`: [`FaasDataInjection`](#faasdatainjection)<`FaasData`<`PathOrData`\>\>) => `Element` \| `Element`[] | - |

___

### FaasReactClientInstance

Ƭ **FaasReactClientInstance**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `faas` | <PathOrData\>(`action`: `string` \| `PathOrData`, `params`: `FaasParams`<`PathOrData`\>) => `Promise`<[`Response`](classes/Response.md)<`FaasData`<`PathOrData`\>\>\> |
| `useFaas` | <PathOrData\>(`action`: `string` \| `PathOrData`, `defaultParams`: `FaasParams`<`PathOrData`\>) => [`FaasDataInjection`](#faasdatainjection)<`FaasData`<`PathOrData`\>\> |
| `FaasDataWrapper` | <PathOrData\>(`props`: [`FaasDataWrapperProps`](#faasdatawrapperprops)<`PathOrData`\>) => `Element` |

___

### Options

Ƭ **Options**: `RequestInit` & { `beforeRequest?`: (`{
    action, params, options
  }`: { `action`: `string` ; `options`: [`Options`](#options) ; `params`: `Record`<`string`, `any`\>  }) => `Promise`<`void`\> \| `void` ; `headers?`: { `[key: string]`: `string`;  }  }

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
| `PathOrData` | extends `FaasAction` |

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

▸ **FaasReactClient**(`__namedParameters`): [`FaasReactClientInstance`](#faasreactclientinstance)

Before use faas, you should initialize a FaasReactClient.

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.domain` | `string` |
| `__namedParameters.onError?` | (`action`: `string`, `params`: `Record`<`string`, `any`\>) => (`res`: [`ResponseError`](classes/ResponseError.md)) => `Promise`<`void`\> |
| `__namedParameters.options?` | [`Options`](#options) |

#### Returns

[`FaasReactClientInstance`](#faasreactclientinstance)

```ts
const client = FaasReactClient({
  domain: 'localhost:8080/api'
})
```

___

### faas

▸ **faas**<`PathOrData`\>(`action`, `params`): `Promise`<[`Response`](classes/Response.md)<`FaasData`<`PathOrData`\>\>\>

Request faas server

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `FaasAction` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | {string} action name |
| `params` | `FaasParams`<`PathOrData`\> | {object} action params |

#### Returns

`Promise`<[`Response`](classes/Response.md)<`FaasData`<`PathOrData`\>\>\>

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

▸ **useFaas**<`PathOrData`\>(`action`, `defaultParams`): [`FaasDataInjection`](#faasdatainjection)<`FaasData`<`PathOrData`\>\>

Request faas server with React hook

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `FaasAction` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | {string} action name |
| `defaultParams` | `FaasParams`<`PathOrData`\> | {object} initial action params |

#### Returns

[`FaasDataInjection`](#faasdatainjection)<`FaasData`<`PathOrData`\>\>

```ts
function Post ({ id }) {
  const { data } = useFaas<{ title: string }>('post/get', { id })
  return <h1>{data.title}</h1>
}
```
