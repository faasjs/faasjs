[**@faasjs/react**](../README.md)

[@faasjs/react](../README.md) / OnError

# Type Alias: OnError

> **OnError** = (`action`, `params`) => (`res`) => `Promise`\<`void`>>>>\>

Factory for per-request error handlers used by [FaasReactClient](../functions/FaasReactClient.md).

The first call receives the action path and params that failed. It must return
an async callback that receives the [ResponseError](../classes/ResponseError.md). `faas` rejects
after the callback resolves, or with the callback's thrown error; `useFaas`
stores the handled error in hook state unless the callback throws a replacement
error.

## Parameters

### action

`string`

Action path that failed.

### params

`Record`\<`string`, `any`\>

Params sent with the failed request.

## Returns

Async callback invoked with the resulting [ResponseError](../classes/ResponseError.md).

(`res`) => `Promise`\<`void`\>
