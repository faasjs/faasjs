[@faasjs/dev](../README.md) / ResolvePluginEvent

# Type Alias: ResolvePluginEvent\<TType\>

> **ResolvePluginEvent**\<`TType`\> = [`NormalizePluginType`](NormalizePluginType.md)\<`TType`\> *extends* keyof [`FaasPluginEventMap`](../interfaces/FaasPluginEventMap.md) ? [`FaasPluginEventMap`](../interfaces/FaasPluginEventMap.md)\[[`NormalizePluginType`](NormalizePluginType.md)\<`TType`\>\] : `Record`\<`never`, `never`\>

## Type Parameters

### TType

`TType` *extends* `string`
