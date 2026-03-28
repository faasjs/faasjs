[@faasjs/react](../README.md) / OnError

# Type Alias: OnError

> **OnError** = (`action`, `params`) => (`res`) => `Promise`\<`void`\>

Factory for per-request error handlers used by [FaasReactClient](../functions/FaasReactClient.md).

## Parameters

### action

`string`

Action name that failed.

### params

`Record`\<`string`, `any`\>

Params sent with the failed request.

## Returns

Async callback invoked with the resulting [ResponseError](../classes/ResponseError.md).

(`res`) => `Promise`\<`void`\>
