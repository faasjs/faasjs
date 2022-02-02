# @faasjs/func

## Table of contents

### Classes

- [Func](classes/Func.md)

### Type aliases

- [Config](modules.md#config)
- [DeployData](modules.md#deploydata)
- [ExportedHandler](modules.md#exportedhandler)
- [FuncConfig](modules.md#funcconfig)
- [Handler](modules.md#handler)
- [InvokeData](modules.md#invokedata)
- [LifeCycleKey](modules.md#lifecyclekey)
- [MountData](modules.md#mountdata)
- [Next](modules.md#next)
- [Plugin](modules.md#plugin)
- [ProviderConfig](modules.md#providerconfig)
- [UseifyPlugin](modules.md#useifyplugin)

### Functions

- [useFunc](modules.md#usefunc)
- [usePlugin](modules.md#useplugin)

## Type aliases

### Config

Ƭ **Config**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `plugins?` | `Object` |
| `providers?` | `Object` |

#### Defined in

[index.ts:26](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L26)

___

### DeployData

Ƭ **DeployData**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config?` | [`Config`](modules.md#config) |
| `dependencies` | `Object` |
| `env?` | `string` |
| `filename` | `string` |
| `logger?` | `Logger` |
| `name?` | `string` |
| `plugins?` | `Object` |
| `root` | `string` |
| `version?` | `string` |

#### Defined in

[index.ts:42](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L42)

___

### ExportedHandler

Ƭ **ExportedHandler**<`TEvent`, `TContext`, `TResult`\>: (`event`: `TEvent`, `context?`: `TContext`, `callback?`: (...`args`: `any`) => `any`) => `Promise`<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

#### Type declaration

▸ (`event`, `context?`, `callback?`): `Promise`<`TResult`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TEvent` |
| `context?` | `TContext` |
| `callback?` | (...`args`: `any`) => `any` |

##### Returns

`Promise`<`TResult`\>

#### Defined in

[index.ts:7](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L7)

___

### FuncConfig

Ƭ **FuncConfig**<`TEvent`, `TContext`, `TResult`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `handler?` | [`Handler`](modules.md#handler)<`TEvent`, `TContext`, `TResult`\> |
| `plugins?` | [`Plugin`](modules.md#plugin)[] |

#### Defined in

[index.ts:88](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L88)

___

### Handler

Ƭ **Handler**<`TEvent`, `TContext`, `TResult`\>: (`data`: [`InvokeData`](modules.md#invokedata)<`TEvent`, `TContext`\>) => `Promise`<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

#### Type declaration

▸ (`data`): `Promise`<`TResult`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`InvokeData`](modules.md#invokedata)<`TEvent`, `TContext`\> |

##### Returns

`Promise`<`TResult`\>

#### Defined in

[index.ts:4](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L4)

___

### InvokeData

Ƭ **InvokeData**<`TEvent`, `TContext`, `TResult`\>: `Object`

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
| `config` | [`Config`](modules.md#config) |
| `context` | `TContext` |
| `event` | `TEvent` |
| `handler?` | [`Handler`](modules.md#handler)<`TEvent`, `TContext`, `TResult`\> |
| `logger` | `Logger` |
| `response` | `any` |

#### Defined in

[index.ts:75](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L75)

___

### LifeCycleKey

Ƭ **LifeCycleKey**: ``"onDeploy"`` \| ``"onMount"`` \| ``"onInvoke"``

#### Defined in

[index.ts:86](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L86)

___

### MountData

Ƭ **MountData**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | [`Config`](modules.md#config) |
| `context` | `any` |
| `event` | `any` |

#### Defined in

[index.ts:68](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L68)

___

### Next

Ƭ **Next**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

##### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:6](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L6)

___

### Plugin

Ƭ **Plugin**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `type` | `string` |
| `onDeploy?` | (`data`: [`DeployData`](modules.md#deploydata), `next`: [`Next`](modules.md#next)) => `void` \| `Promise`<`void`\> |
| `onInvoke?` | (`data`: [`InvokeData`](modules.md#invokedata)<`any`, `any`, `any`\>, `next`: [`Next`](modules.md#next)) => `void` \| `Promise`<`void`\> |
| `onMount?` | (`data`: [`MountData`](modules.md#mountdata), `next`: [`Next`](modules.md#next)) => `void` \| `Promise`<`void`\> |

#### Defined in

[index.ts:10](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L10)

___

### ProviderConfig

Ƭ **ProviderConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | `Object` |
| `type` | `string` |

#### Defined in

[index.ts:19](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L19)

___

### UseifyPlugin

Ƭ **UseifyPlugin**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `mount?` | (`data`: { `config`: [`Config`](modules.md#config)  }) => `Promise`<`void`\> |

#### Defined in

[index.ts:299](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L299)

## Functions

### useFunc

▸ **useFunc**<`TEvent`, `TContext`, `TResult`\>(`handler`): [`Func`](classes/Func.md)<`TEvent`, `TContext`, `TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `handler` | () => [`Handler`](modules.md#handler)<`TEvent`, `TContext`, `TResult`\> |

#### Returns

[`Func`](classes/Func.md)<`TEvent`, `TContext`, `TResult`\>

#### Defined in

[index.ts:319](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L319)

___

### usePlugin

▸ **usePlugin**<`T`\>(`plugin`): `T` & [`UseifyPlugin`](modules.md#useifyplugin)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Plugin`](modules.md#plugin) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `plugin` | `T` & [`UseifyPlugin`](modules.md#useifyplugin) |

#### Returns

`T` & [`UseifyPlugin`](modules.md#useifyplugin)

#### Defined in

[index.ts:303](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L303)
