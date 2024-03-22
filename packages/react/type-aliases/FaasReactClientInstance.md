[@faasjs/react](../README.md) / FaasReactClientInstance

# Type alias: FaasReactClientInstance

> **FaasReactClientInstance**: `Object`

## Type declaration

### faas()

> **faas**: \<`PathOrData`\>(`action`, `params`) => `Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

#### Type parameters

• **PathOrData** extends `FaasAction`

#### Parameters

• **action**: `string` \| `PathOrData`

• **params**: `FaasParams`\<`PathOrData`\>

#### Returns

`Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

### id

> **id**: `string`

### useFaas()

> **useFaas**: \<`PathOrData`\>(`action`, `defaultParams`, `options`?) => [`FaasDataInjection`](FaasDataInjection.md)\<`FaasData`\<`PathOrData`\>\>

#### Type parameters

• **PathOrData** extends `FaasAction`

#### Parameters

• **action**: `string` \| `PathOrData`

• **defaultParams**: `FaasParams`\<`PathOrData`\>

• **options?**: [`useFaasOptions`](useFaasOptions.md)\<`PathOrData`\>

#### Returns

[`FaasDataInjection`](FaasDataInjection.md)\<`FaasData`\<`PathOrData`\>\>

### FaasDataWrapper()

#### Type parameters

• **PathOrData** extends `FaasAction`

#### Parameters

• **props**: [`FaasDataWrapperProps`](FaasDataWrapperProps.md)\<`PathOrData`\>

#### Returns

`Element`
