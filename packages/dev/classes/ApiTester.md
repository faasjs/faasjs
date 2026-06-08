[@faasjs/dev](../README.md) / ApiTester

# Class: ApiTester\<TApi\>

Wrap a FaasJS API with helpers for mounting and assertion-friendly invocations.

The tester resolves config for the current `FaasEnv` or `development`, mounts lazily, and
exposes helpers for raw handler calls and HTTP-style JSON assertions. When the wrapped
API has a filename under `src/`, JSON requests infer the pathname from FaasJS API file
conventions such as `index.api.ts`, `default.api.ts`, and nested `*.api.ts` files.

## See

[testApi](../functions/testApi.md)

## Example

```ts
import { ApiTester } from '@faasjs/dev'
import api from './hello.api'

const wrapped = new ApiTester(api)

const response = await wrapped.JSONhandler({ name: 'FaasJS' })
```

## Type Parameters

### TApi

`TApi` _extends_ [`Func`](Func.md)\<`any`, `any`, `any`\> = [`Func`](Func.md)\<`any`, `any`, `any`\>

Wrapped FaasJS API type.

## Constructors

### Constructor

> **new ApiTester**\<`TApi`\>(`api`): `ApiTester`\<`TApi`\>

Create a tester around a FaasJS API instance for repeated test calls.

#### Parameters

##### api

`TApi`

API instance to wrap.

#### Returns

`ApiTester`\<`TApi`\>

#### Example

```ts
import { ApiTester } from '@faasjs/dev'
import api from './hello.api'

const wrapped = new ApiTester(api)
```

## Methods

### handler()

> **handler**\<`TResult`\>(`event?`, `context?`): `Promise`\<`TResult`\>

Invoke the wrapped API with raw event and context payloads.

#### Type Parameters

##### TResult

`TResult` = `any`

Expected response type returned by the handler.

#### Parameters

##### event?

`Record`\<`string`, `unknown`\> = `...`

Runtime event passed to the exported handler.

##### context?

`Record`\<`string`, `unknown`\> = `...`

Runtime context passed to the exported handler.

#### Returns

`Promise`\<`TResult`\>

Handler result.

### JSONhandler()

> **JSONhandler**\<`TData`\>(`body?`, `options?`): `Promise`\<[`JsonHandlerResult`](../type-aliases/JsonHandlerResult.md)\<`TData`\>\>

Invoke an HTTP-enabled API with JSON body helpers and decoded cookies.

The helper mounts the API, sends a POST request with `content-type: application/json`,
stringifies non-string bodies, and leaves string bodies untouched for malformed-JSON
or raw-payload tests. JSON responses populate `data` and `error`; response
`Set-Cookie` headers are merged back into the returned `cookie` object and the
session cookie is decoded into `session`.

ReadableStream response bodies are consumed into strings before JSON parsing. If
stream decoding fails, the result is normalized to a 500-style JSON error object
so tests can assert `response.error.message`.

#### Type Parameters

##### TData

`TData` = `any`

Expected JSON `data` payload returned by the API.

#### Parameters

##### body?

[`JsonHandlerBody`](../type-aliases/JsonHandlerBody.md)\<`TApi`\>

Request body object or raw JSON string.

##### options?

[`JsonHandlerOptions`](../type-aliases/JsonHandlerOptions.md) = `...`

Extra headers, request cookies, and session seed values.

#### Returns

`Promise`\<[`JsonHandlerResult`](../type-aliases/JsonHandlerResult.md)\<`TData`\>\>

Normalized HTTP response payload for assertions.

#### Throws

When the wrapped API does not use the HTTP plugin.

#### Example

```ts
import { testApi } from '@faasjs/dev'
import api from './hello.api'

const handler = testApi(api)
const response = await handler({ name: 'FaasJS' }, { session: { userId: '1' } })

expect(response.data).toEqual({ message: 'Hello, FaasJS' })
```

### mount()

> **mount**(`handler?`): `Promise`\<`void`\>

Mount the wrapped API once before running assertions.

#### Parameters

##### handler?

(`api`) => `void` \| `Promise`\<`void`\>

Optional callback invoked after mount.

#### Returns

`Promise`\<`void`\>

Resolves after the API has been mounted and the callback has finished.

## Properties

### api

> `readonly` **api**: `TApi`

Wrapped API instance.

### config

> `readonly` **config**: [`Config`](../type-aliases/Config.md)

Resolved config attached to the wrapped API.

### file

> `readonly` **file**: `string`

Source file path inferred from the wrapped API.

### logger

> `readonly` **logger**: `Logger`

Logger used by helper methods.

### staging

> `readonly` **staging**: `string`

Active staging name used while loading config.
