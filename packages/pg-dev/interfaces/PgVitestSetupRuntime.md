[@faasjs/pg-dev](../README.md) / PgVitestSetupRuntime

# Interface: PgVitestSetupRuntime

Runtime hooks provided by the Vitest project that `setupPgVitest` wires into.

## Properties

### afterAll

> **afterAll**: (`callback`) => `void`

Lifecycle hook called once after all tests in the file finish.

#### Parameters

##### callback

() => `Awaitable`\<`void`\>

#### Returns

`void`

### beforeEach

> **beforeEach**: (`callback`) => `void`

Lifecycle hook called before each test in the file.

#### Parameters

##### callback

() => `Awaitable`\<`void`\>

#### Returns

`void`

### projectRoot?

> `optional` **projectRoot?**: `string`

Optional project root directory. Defaults to `process.cwd()`.
