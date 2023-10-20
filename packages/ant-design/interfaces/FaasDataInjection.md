# Interface: FaasDataInjection<Data\>

Injects FaasData props.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Data` | `any` |

## Table of contents

### Properties

- [action](FaasDataInjection.md#action)
- [data](FaasDataInjection.md#data)
- [error](FaasDataInjection.md#error)
- [loading](FaasDataInjection.md#loading)
- [params](FaasDataInjection.md#params)
- [promise](FaasDataInjection.md#promise)
- [setData](FaasDataInjection.md#setdata)
- [setError](FaasDataInjection.md#seterror)
- [setLoading](FaasDataInjection.md#setloading)
- [setPromise](FaasDataInjection.md#setpromise)

### Methods

- [reload](FaasDataInjection.md#reload)

## Properties

### action

• **action**: `any`

___

### data

• **data**: `Data`

___

### error

• **error**: `any`

___

### loading

• **loading**: `boolean`

___

### params

• **params**: `Record`<`string`, `any`\>

___

### promise

• **promise**: `Promise`<`Response`<`Data`\>\>

___

### setData

• **setData**: `Dispatch`<`SetStateAction`<`Data`\>\>

___

### setError

• **setError**: `Dispatch`<`any`\>

___

### setLoading

• **setLoading**: `Dispatch`<`SetStateAction`<`boolean`\>\>

___

### setPromise

• **setPromise**: `Dispatch`<`SetStateAction`<`Promise`<`Response`<`Data`\>\>\>\>

## Methods

### reload

▸ **reload**(`params?`): `Promise`<`Response`<`Data`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Record`<`string`, `any`\> |

#### Returns

`Promise`<`Response`<`Data`\>\>
