# Interface: FaasReactClientInstance

## Table of contents

### Properties

- [faas](FaasReactClientInstance.md#faas)
- [useFaas](FaasReactClientInstance.md#usefaas)

### Methods

- [FaasDataWrapper](FaasReactClientInstance.md#faasdatawrapper)

## Properties

### faas

• **faas**: <PathOrData\>(`action`: `string` \| `PathOrData`, `params`: [`FaasParams`](../modules.md#faasparams)<`PathOrData`\>) => `Promise`<[`Response`](../classes/Response.md)<[`FaasData`](../modules.md#faasdata)<`PathOrData`\>\>\>

#### Type declaration

▸ <`PathOrData`\>(`action`, `params`): `Promise`<[`Response`](../classes/Response.md)<[`FaasData`](../modules.md#faasdata)<`PathOrData`\>\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `Record`<`string`, `any`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `string` \| `PathOrData` |
| `params` | [`FaasParams`](../modules.md#faasparams)<`PathOrData`\> |

##### Returns

`Promise`<[`Response`](../classes/Response.md)<[`FaasData`](../modules.md#faasdata)<`PathOrData`\>\>\>

___

### useFaas

• **useFaas**: <PathOrData\>(`action`: `string` \| `PathOrData`, `defaultParams`: [`FaasParams`](../modules.md#faasparams)<`PathOrData`\>, `options?`: { `data?`: [`FaasData`](../modules.md#faasdata)<`PathOrData`\> ; `setData?`: `Dispatch`<`SetStateAction`<[`FaasData`](../modules.md#faasdata)<`PathOrData`\>\>\> ; `skip?`: `boolean`  }) => [`FaasDataInjection`](FaasDataInjection.md)<[`FaasData`](../modules.md#faasdata)<`PathOrData`\>\>

#### Type declaration

▸ <`PathOrData`\>(`action`, `defaultParams`, `options?`): [`FaasDataInjection`](FaasDataInjection.md)<[`FaasData`](../modules.md#faasdata)<`PathOrData`\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `Record`<`string`, `any`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `string` \| `PathOrData` |
| `defaultParams` | [`FaasParams`](../modules.md#faasparams)<`PathOrData`\> |
| `options?` | `Object` |
| `options.data?` | [`FaasData`](../modules.md#faasdata)<`PathOrData`\> |
| `options.setData?` | `Dispatch`<`SetStateAction`<[`FaasData`](../modules.md#faasdata)<`PathOrData`\>\>\> |
| `options.skip?` | `boolean` |

##### Returns

[`FaasDataInjection`](FaasDataInjection.md)<[`FaasData`](../modules.md#faasdata)<`PathOrData`\>\>

## Methods

### FaasDataWrapper

▸ **FaasDataWrapper**<`PathOrData`\>(`props`): `Element`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `Record`<`string`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FaasDataWrapperProps`](FaasDataWrapperProps.md)<`PathOrData`\> |

#### Returns

`Element`
