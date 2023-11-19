# @faasjs/func

[![License: MIT](https://img.shields.io/npm/l/@faasjs/func.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/func/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/func/stable.svg)](https://www.npmjs.com/package/@faasjs/func)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/func/beta.svg)](https://www.npmjs.com/package/@faasjs/func)

FaasJS's function module.

## Install

    npm install @faasjs/func

## Modules

### Classes

- [Func](classes/Func.md)

### Type Aliases

- [Config](#config)
- [DeployData](#deploydata)
- [ExportedHandler](#exportedhandler)
- [FuncConfig](#funcconfig)
- [Handler](#handler)
- [InvokeData](#invokedata)
- [LifeCycleKey](#lifecyclekey)
- [MountData](#mountdata)
- [Next](#next)
- [Plugin](#plugin)
- [ProviderConfig](#providerconfig)
- [UseifyPlugin](#useifyplugin)

### Functions

- [useFunc](#usefunc)
- [usePlugin](#useplugin)

## Type Aliases

### Config

Ƭ **Config**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `plugins?` | \{ `[key: string]`: \{ `[key: string]`: `any`; `config?`: \{ `[key: string]`: `any`;  } ; `provider?`: `string` \| [`ProviderConfig`](#providerconfig) ; `type`: `string`  };  } |
| `providers?` | \{ `[key: string]`: [`ProviderConfig`](#providerconfig);  } |

___

### DeployData

Ƭ **DeployData**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config?` | [`Config`](#config) |
| `dependencies` | \{ `[name: string]`: `string`;  } |
| `env?` | `string` |
| `filename` | `string` |
| `logger?` | `Logger` |
| `name?` | `string` |
| `plugins?` | \{ `[name: string]`: \{ `[key: string]`: `any`; `config`: \{ `[key: string]`: `any`;  } ; `name?`: `string` ; `plugin`: [`Plugin`](#plugin) ; `provider?`: `string` ; `type`: `string`  };  } |
| `root` | `string` |
| `version?` | `string` |

___

### ExportedHandler

Ƭ **ExportedHandler**\<`TEvent`, `TContext`, `TResult`\>: (`event`: `TEvent`, `context?`: `TContext`, `callback?`: (...`args`: `any`) => `any`) => `Promise`\<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

#### Type declaration

▸ (`event`, `context?`, `callback?`): `Promise`\<`TResult`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TEvent` |
| `context?` | `TContext` |
| `callback?` | (...`args`: `any`) => `any` |

##### Returns

`Promise`\<`TResult`\>

___

### FuncConfig

Ƭ **FuncConfig**\<`TEvent`, `TContext`, `TResult`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `handler?` | [`Handler`](#handler)\<`TEvent`, `TContext`, `TResult`\> |
| `plugins?` | [`Plugin`](#plugin)[] |

___

### Handler

Ƭ **Handler**\<`TEvent`, `TContext`, `TResult`\>: (`data`: [`InvokeData`](#invokedata)\<`TEvent`, `TContext`\>) => `Promise`\<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

#### Type declaration

▸ (`data`): `Promise`\<`TResult`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`InvokeData`](#invokedata)\<`TEvent`, `TContext`\> |

##### Returns

`Promise`\<`TResult`\>

___

### InvokeData

Ƭ **InvokeData**\<`TEvent`, `TContext`, `TResult`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `callback` | `any` |
| `config` | [`Config`](#config) |
| `context` | `TContext` |
| `event` | `TEvent` |
| `handler?` | [`Handler`](#handler)\<`TEvent`, `TContext`, `TResult`\> |
| `logger` | `Logger` |
| `response` | `any` |

___

### LifeCycleKey

Ƭ **LifeCycleKey**: ``"onDeploy"`` \| ``"onMount"`` \| ``"onInvoke"``

___

### MountData

Ƭ **MountData**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](#config) |
| `context` | `any` |
| `event` | `any` |

___

### Next

Ƭ **Next**: () => `Promise`\<`void`\>

#### Type declaration

▸ (): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

___

### Plugin

Ƭ **Plugin**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `onDeploy?` | (`data`: [`DeployData`](#deploydata), `next`: [`Next`](#next)) => `Promise`\<`void`\> |
| `onInvoke?` | (`data`: [`InvokeData`](#invokedata), `next`: [`Next`](#next)) => `Promise`\<`void`\> |
| `onMount?` | (`data`: [`MountData`](#mountdata), `next`: [`Next`](#next)) => `Promise`\<`void`\> |
| `type` | `string` |

___

### ProviderConfig

Ƭ **ProviderConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | \{ `[key: string]`: `any`;  } |
| `type` | `string` |

___

### UseifyPlugin

Ƭ **UseifyPlugin**\<`T`\>: `T` & \{ `mount?`: (`data?`: \{ `config?`: [`Config`](#config)  }) => `Promise`\<`T`\>  }

#### Type parameters

| Name |
| :------ |
| `T` |

## Functions

### useFunc

▸ **useFunc**\<`TEvent`, `TContext`, `TResult`\>(`handler`): [`Func`](classes/Func.md)\<`TEvent`, `TContext`, `TResult`\>

```ts
// pure function
export default useFunc(() => {
  return () => {
    return 'Hello World'
  }
})

// with http
import { useHttp } from '@faasjs/http'

export default useFunc(() => {
  const http = useHttp<{ name: string }>()

  return () => {
    return `Hello ${http.params.name}`
  }
})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `handler` | () => [`Handler`](#handler)\<`TEvent`, `TContext`, `TResult`\> |

#### Returns

[`Func`](classes/Func.md)\<`TEvent`, `TContext`, `TResult`\>

___

### usePlugin

▸ **usePlugin**\<`T`\>(`plugin`): [`UseifyPlugin`](#useifyplugin)\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Plugin`](#plugin) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `plugin` | [`UseifyPlugin`](#useifyplugin)\<`T`\> |

#### Returns

[`UseifyPlugin`](#useifyplugin)\<`T`\>
