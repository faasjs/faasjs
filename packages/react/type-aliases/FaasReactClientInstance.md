[@faasjs/react](../README.md) / FaasReactClientInstance

# Type Alias: FaasReactClientInstance

> **FaasReactClientInstance**: `object`

## Type declaration

### browserClient

> **browserClient**: `FaasBrowserClient`

### faas()

> **faas**: \<`PathOrData`\>(`action`, `params`, `options`?) => `Promise`\<`Response`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

#### Type Parameters

• **PathOrData** *extends* [`FaasAction`](FaasAction.md)

#### Parameters

• **action**: `string` \| `PathOrData`

• **params**: [`FaasParams`](FaasParams.md)\<`PathOrData`\>

• **options?**: [`Options`](Options.md)

#### Returns

`Promise`\<`Response`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

### id

> **id**: `string`

### onError

> **onError**: `OnError`

### useFaas()

> **useFaas**: \<`PathOrData`\>(`action`, `defaultParams`, `options`?) => [`FaasDataInjection`](FaasDataInjection.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>

#### Type Parameters

• **PathOrData** *extends* [`FaasAction`](FaasAction.md)

#### Parameters

• **action**: `string` \| `PathOrData`

• **defaultParams**: [`FaasParams`](FaasParams.md)\<`PathOrData`\>

• **options?**: [`useFaasOptions`](useFaasOptions.md)\<`PathOrData`\>

#### Returns

[`FaasDataInjection`](FaasDataInjection.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>

### FaasDataWrapper()

#### Type Parameters

• **PathOrData** *extends* [`FaasAction`](FaasAction.md)

#### Parameters

• **props**: [`FaasDataWrapperProps`](FaasDataWrapperProps.md)\<`PathOrData`\>

#### Returns

`Element`
