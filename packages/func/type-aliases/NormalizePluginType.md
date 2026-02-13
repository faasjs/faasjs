[@faasjs/func](../README.md) / NormalizePluginType

# Type Alias: NormalizePluginType\<TType\>

> **NormalizePluginType**\<`TType`\> = `TType` *extends* `` `npm:${infer Name}` `` ? `Name` : `TType` *extends* `` `@faasjs/${infer Name}` `` ? `Name` : `TType`

## Type Parameters

### TType

`TType` *extends* `string`
