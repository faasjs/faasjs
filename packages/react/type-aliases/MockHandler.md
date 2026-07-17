[@faasjs/react](../README.md) / MockHandler

# Type Alias: MockHandler

> **MockHandler** = (`action`, `params`, `options`) => `Promise`\<[`ResponseProps`](ResponseProps.md)> > > > \> \| `Promise`\<`void`> > > > \> \| `Promise`\<`Error`>>>>\>

Mock handler function type for testing FaasJS requests.

The handler receives the action path, request params, and fully resolved
request options. Returning an `Error` makes the request reject with a
response error; returning nothing creates an empty successful response.

## Parameters

### action

`string`

### params

`Record`\<`string`, `any`\> \| `undefined`

### options

[`Options`](Options.md)

## Returns

`Promise`\<[`ResponseProps`](ResponseProps.md)\> \| `Promise`\<`void`\> \| `Promise`\<`Error`\>
