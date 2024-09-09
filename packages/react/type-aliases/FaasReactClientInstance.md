[@faasjs/react](../README.md) / FaasReactClientInstance

# Type Alias: FaasReactClientInstance

> **FaasReactClientInstance**: `object`

## Type declaration

### faas()

> **faas**: \<`PathOrData`\>(`action`, `params`) => `Promise`\<`Response`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

#### Type Parameters

• **PathOrData** *extends* [`FaasAction`](FaasAction.md)

#### Parameters

• **action**: `string` \| `PathOrData`

• **params**: [`FaasParams`](FaasParams.md)\<`PathOrData`\>

#### Returns

`Promise`\<`Response`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

### id

> **id**: `string`

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

• **PathOrData** *extends* `Record`\<`string`, `any`\>

#### Parameters

• **props**: [`FaasDataWrapperProps`](FaasDataWrapperProps.md)\<`PathOrData`\>

#### Returns

`Element`
