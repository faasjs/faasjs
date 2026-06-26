[@faasjs/dev](../README.md) / TestApiHandler

# Type Alias: TestApiHandler\<TApi\>

> **TestApiHandler**\<`TApi`\> = `Pick`\<[`ApiTester`](../classes/ApiTester.md)\<`TApi`\>, `"api"` \| `"config"` \| `"file"` \| `"handler"` \| `"JSONhandler"` \| `"logger"` \| `"mount"` \| `"staging"`\> & \<`TData`\>(`body?`, `options?`) => `Promise`\<[`JsonHandlerResult`](JsonHandlerResult.md)\<`TData`\>\>

Callable helper returned by [testApi](../functions/testApi.md).

## Type Parameters

### TApi

`TApi` _extends_ `Func`\<`any`, `any`, `any`\>
