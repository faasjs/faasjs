# @faasjs/react

## Table of contents

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
- [getClient](modules.md#getclient)

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

#### Defined in

[react/src/index.tsx:17](https://github.com/faasjs/faasjs/blob/1705fd2/packages/react/src/index.tsx#L17)

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
| `render?` | (`args`: [`FaasDataInjection`](modules.md#faasdatainjection)<`FaasData`<`PathOrData`\>\>) => `Element` | - |

#### Defined in

[react/src/index.tsx:31](https://github.com/faasjs/faasjs/blob/1705fd2/packages/react/src/index.tsx#L31)

___

### FaasReactClientInstance

Ƭ **FaasReactClientInstance**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FaasDataWrapper` | <PathOrData\>(`props`: [`FaasDataWrapperProps`](modules.md#faasdatawrapperprops)<`PathOrData`\>) => `Element` |
| `faas` | <PathOrData\>(`action`: `string` \| `PathOrData`, `params`: `FaasParams`<`PathOrData`\>) => `Promise`<[`Response`](classes/Response.md)<`FaasData`<`PathOrData`\>\>\> |
| `useFaas` | <PathOrData\>(`action`: `string` \| `PathOrData`, `defaultParams`: `FaasParams`<`PathOrData`\>) => [`FaasDataInjection`](modules.md#faasdatainjection)<`FaasData`<`PathOrData`\>\> |

#### Defined in

[react/src/index.tsx:43](https://github.com/faasjs/faasjs/blob/1705fd2/packages/react/src/index.tsx#L43)

___

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

## Functions

### FaasDataWrapper

▸ **FaasDataWrapper**<`PathOrData`\>(`props`): `JSX.Element`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `FaasAction` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FaasDataWrapperProps`](modules.md#faasdatawrapperprops)<`PathOrData`\> & { `client?`: [`FaasReactClientInstance`](modules.md#faasreactclientinstance)  } |

#### Returns

`JSX.Element`

#### Defined in

[react/src/index.tsx:194](https://github.com/faasjs/faasjs/blob/1705fd2/packages/react/src/index.tsx#L194)

___

### FaasReactClient

▸ **FaasReactClient**(`__namedParameters`): [`FaasReactClientInstance`](modules.md#faasreactclientinstance)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.domain` | `string` |
| `__namedParameters.options?` | [`Options`](modules.md#options) |
| `__namedParameters.onError?` | (`action`: `string`, `params`: `Record`<`string`, `any`\>) => (`res`: [`ResponseError`](classes/ResponseError.md)) => `Promise`<`void`\> |

#### Returns

[`FaasReactClientInstance`](modules.md#faasreactclientinstance)

#### Defined in

[react/src/index.tsx:59](https://github.com/faasjs/faasjs/blob/1705fd2/packages/react/src/index.tsx#L59)

___

### getClient

▸ **getClient**(`domain?`): [`FaasReactClientInstance`](modules.md#faasreactclientinstance)

#### Parameters

| Name | Type |
| :------ | :------ |
| `domain?` | `string` |

#### Returns

[`FaasReactClientInstance`](modules.md#faasreactclientinstance)

#### Defined in

[react/src/index.tsx:186](https://github.com/faasjs/faasjs/blob/1705fd2/packages/react/src/index.tsx#L186)
