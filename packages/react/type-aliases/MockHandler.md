[@faasjs/react](../README.md) / MockHandler

# Type Alias: MockHandler

> **MockHandler** = (`action`, `params`, `options`) => `Promise`\<[`ResponseProps`](ResponseProps.md)\> \| `Promise`\<`void`\> \| `Promise`\<`Error`\>

Mock handler function type for testing FaasJS requests.

## Parameters

### action

`string`

### params

`Record`\<`string`, `any`\> \| `undefined`

### options

[`Options`](Options.md)

## Returns

`Promise`\<[`ResponseProps`](ResponseProps.md)\> \| `Promise`\<`void`\> \| `Promise`\<`Error`\>
