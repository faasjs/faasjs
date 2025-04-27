[@faasjs/cloud_function](../README.md) / CloudFunctionAdapter

# Type Alias: CloudFunctionAdapter

> **CloudFunctionAdapter** = `object`

## Properties

### invokeCloudFunction()

> **invokeCloudFunction**: (`name`, `data`, `options?`) => `Promise`\<`void`\>

#### Parameters

##### name

`string`

##### data

`any`

##### options?

`any`

#### Returns

`Promise`\<`void`\>

### invokeSyncCloudFunction()

> **invokeSyncCloudFunction**: \<`TResult`\>(`name`, `data`, `options?`) => `Promise`\<`TResult`\>

#### Type Parameters

##### TResult

`TResult`

#### Parameters

##### name

`string`

##### data

`any`

##### options?

`any`

#### Returns

`Promise`\<`TResult`\>
