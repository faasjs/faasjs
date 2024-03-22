[@faasjs/cloud_function](../README.md) / CloudFunctionAdapter

# Type alias: CloudFunctionAdapter

> **CloudFunctionAdapter**: `Object`

## Type declaration

### invokeCloudFunction()

> **invokeCloudFunction**: (`name`, `data`, `options`?) => `Promise`\<`void`\>

#### Parameters

• **name**: `string`

• **data**: `any`

• **options?**: `any`

#### Returns

`Promise`\<`void`\>

### invokeSyncCloudFunction()

> **invokeSyncCloudFunction**: \<`TResult`\>(`name`, `data`, `options`?) => `Promise`\<`TResult`\>

#### Type parameters

• **TResult**

#### Parameters

• **name**: `string`

• **data**: `any`

• **options?**: `any`

#### Returns

`Promise`\<`TResult`\>
