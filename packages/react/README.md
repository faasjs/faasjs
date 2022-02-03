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

### Type aliases

- [FaasDataInjection](modules.md#faasdatainjection)
- [FaasDataWrapperProps](modules.md#faasdatawrapperprops)
- [FaasReactClientInstance](modules.md#faasreactclientinstance)
- [Options](modules.md#options)
- [ResponseHeaders](modules.md#responseheaders)

### Functions

- [FaasDataWrapper](modules.md#faasdatawrapper)
- [FaasReactClient](modules.md#faasreactclient)
- [faas](modules.md#faas)
- [getClient](modules.md#getclient)
- [useFaas](modules.md#usefaas)

## Type aliases

### FaasDataInjection

Ƭ **FaasDataInjection**<`Data`\>: `Object`

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
| `onDataChange?` | (`args`: [`FaasDataInjection`](modules.md#faasdatainjection)<`FaasData`<`PathOrData`\>\>) => `void` | - |
| `render?` | (`args`: [`FaasDataInjection`](modules.md#faasdatainjection)<`FaasData`<`PathOrData`\>\>) => `Element` \| `Element`[] | - |

___

### FaasReactClientInstance

Ƭ **FaasReactClientInstance**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FaasDataWrapper` | <PathOrData\>(`props`: [`FaasDataWrapperProps`](modules.md#faasdatawrapperprops)<`PathOrData`\>) => `Element` |
| `faas` | <PathOrData\>(`action`: `string` \| `PathOrData`, `params`: `FaasParams`<`PathOrData`\>) => `Promise`<[`Response`](classes/Response.md)<`FaasData`<`PathOrData`\>\>\> |
| `useFaas` | <PathOrData\>(`action`: `string` \| `PathOrData`, `defaultParams`: `FaasParams`<`PathOrData`\>) => [`FaasDataInjection`](modules.md#faasdatainjection)<`FaasData`<`PathOrData`\>\> |

___

### Options

Ƭ **Options**: `RequestInit` & { `headers?`: { [key: string]: `string`;  } ; `beforeRequest?`: (`__namedParameters`: { `action`: `string` ; `options`: [`Options`](modules.md#options) ; `params`: `Record`<`string`, `any`\>  }) => `void` \| `Promise`<`void`\>  }

___

### ResponseHeaders

Ƭ **ResponseHeaders**: `Object`

#### Index signature

▪ [key: `string`]: `string`

## Functions

### FaasDataWrapper

▸ **FaasDataWrapper**<`PathOrData`\>(`props`): `JSX.Element`

A data wrapper for react components

**`example`**
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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `FaasAction` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FaasDataWrapperProps`](modules.md#faasdatawrapperprops)<`PathOrData`\> |

#### Returns

`JSX.Element`

___

### FaasReactClient

▸ **FaasReactClient**(`__namedParameters`): [`FaasReactClientInstance`](modules.md#faasreactclientinstance)

Before use faas, you should initialize a FaasReactClient.

**`example`**
```ts
const client = FaasReactClient({
  domain: 'localhost:8080/api'
})
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.domain` | `string` |
| `__namedParameters.options?` | [`Options`](modules.md#options) |
| `__namedParameters.onError?` | (`action`: `string`, `params`: `Record`<`string`, `any`\>) => (`res`: [`ResponseError`](classes/ResponseError.md)) => `Promise`<`void`\> |

#### Returns

[`FaasReactClientInstance`](modules.md#faasreactclientinstance)

___

### faas

▸ **faas**<`PathOrData`\>(`action`, `params`): `Promise`<[`Response`](classes/Response.md)<`FaasData`<`PathOrData`\>\>\>

Request faas server

**`example`**
```ts
faas<{ title: string }>('post/get', { id: 1 }).then(res => {
  console.log(res.data.title)
})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `FaasAction` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | action name |
| `params` | `FaasParams`<`PathOrData`\> | action params |

#### Returns

`Promise`<[`Response`](classes/Response.md)<`FaasData`<`PathOrData`\>\>\>

___

### getClient

▸ **getClient**(`domain?`): [`FaasReactClientInstance`](modules.md#faasreactclientinstance)

Get FaasReactClient instance

**`example`**
```ts
getClient()
// or
getClient('another-domain')
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `domain?` | `string` | empty string for default domain |

#### Returns

[`FaasReactClientInstance`](modules.md#faasreactclientinstance)

___

### useFaas

▸ **useFaas**<`PathOrData`\>(`action`, `defaultParams`): [`FaasDataInjection`](modules.md#faasdatainjection)<`FaasData`<`PathOrData`\>\>

Request faas server with React hook

**`example`**
```ts
function Post ({ id }) {
  const { data } = useFaas<{ title: string }>('post/get', { id })
  return <h1>{data.title}</h1>
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `FaasAction` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | action name |
| `defaultParams` | `FaasParams`<`PathOrData`\> | initial action params |

#### Returns

[`FaasDataInjection`](modules.md#faasdatainjection)<`FaasData`<`PathOrData`\>\>
