[**@faasjs/dev**](../README.md)

[@faasjs/dev](../README.md) / JsonHandlerBody

# Type Alias: JsonHandlerBody\<TApi\>

> **JsonHandlerBody**\<`TApi`> > > > > > \> = `FuncEventType`\<`TApi`> > > > > > \> _extends_ `object` ? `0` _extends_ `1` & `TParams` ? `Record`\<`string`, `any`> > > > > > \> \| `string` \| `null` : `TParams` \| `string` \| `null` : `Record`\<`string`, `any`> > > > > > \> \| `string` \| `null`

Request body accepted by [ApiTester.JSONhandler](../classes/ApiTester.md#jsonhandler) and [testApi](../functions/testApi.md).

Uses the wrapped API params type when it can be inferred; raw strings are also
accepted so tests can send malformed JSON or custom payloads.

## Type Parameters

### TApi

`TApi` _extends_ `Func`\<`any`, `any`, `any`\>
