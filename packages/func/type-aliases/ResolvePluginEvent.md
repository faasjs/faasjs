[@faasjs/func](../README.md) / ResolvePluginEvent

# Type Alias: ResolvePluginEvent\<TType\>

> **ResolvePluginEvent**\<`TType`\> = [`NormalizePluginType`](NormalizePluginType.md)\<`TType`\> _extends_ keyof [`FaasPluginEventMap`](../interfaces/FaasPluginEventMap.md) ? [`FaasPluginEventMap`](../interfaces/FaasPluginEventMap.md)\[[`NormalizePluginType`](NormalizePluginType.md)\<`TType`\>\] : `Record`\<`never`, `never`\>

## Type Parameters

### TType

`TType` _extends_ `string`
