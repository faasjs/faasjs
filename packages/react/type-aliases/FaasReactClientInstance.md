[@faasjs/react](../README.md) / FaasReactClientInstance

# Type Alias: FaasReactClientInstance

> **FaasReactClientInstance** = `object`

## Methods

### FaasDataWrapper()

> **FaasDataWrapper**\<`PathOrData`\>(`props`): `Element`

#### Type Parameters

##### PathOrData

`PathOrData` *extends* `FaasActionUnionType`

#### Parameters

##### props

[`FaasDataWrapperProps`](FaasDataWrapperProps.md)\<`PathOrData`\>

#### Returns

`Element`

## Properties

### browserClient

> **browserClient**: `FaasBrowserClient`

### faas()

> **faas**: \<`PathOrData`\>(`action`, `params`, `options`?) => `Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

#### Type Parameters

##### PathOrData

`PathOrData` *extends* `FaasActionUnionType`

#### Parameters

##### action

[`FaasAction`](FaasAction.md)\<`PathOrData`\>

##### params

[`FaasParams`](FaasParams.md)\<`PathOrData`\>

##### options?

[`Options`](Options.md)

#### Returns

`Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

### id

> **id**: `string`

### onError?

> `optional` **onError**: [`OnError`](OnError.md)

### useFaas()

> **useFaas**: \<`PathOrData`\>(`action`, `defaultParams`, `options`?) => [`FaasDataInjection`](FaasDataInjection.md)\<`PathOrData`\>

#### Type Parameters

##### PathOrData

`PathOrData` *extends* `FaasActionUnionType`

#### Parameters

##### action

[`FaasAction`](FaasAction.md)\<`PathOrData`\>

##### defaultParams

[`FaasParams`](FaasParams.md)\<`PathOrData`\>

##### options?

[`useFaasOptions`](useFaasOptions.md)\<`PathOrData`\>

#### Returns

[`FaasDataInjection`](FaasDataInjection.md)\<`PathOrData`\>
