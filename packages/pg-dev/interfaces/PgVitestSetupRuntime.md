[**@faasjs/pg-dev**](../README.md)

[@faasjs/pg-dev](../README.md) / PgVitestSetupRuntime

# Interface: PgVitestSetupRuntime

Runtime hooks provided by the Vitest project that `setupPgVitest` wires into.

Pass Vitest's `afterAll` and `beforeEach` functions from the active setup module.
`projectRoot` should point at the project whose `src/db/migrations` directory should
be applied to the temporary database.

## Properties

### afterAll

> **afterAll**: (`callback`) => `void`

Lifecycle hook called once after all tests in the file finish.

#### Parameters

##### callback

() => `void` \| `Promise`\<`void`\>

#### Returns

`void`

### beforeEach

> **beforeEach**: (`callback`) => `void`

Lifecycle hook called before each test in the file.

#### Parameters

##### callback

() => `void` \| `Promise`\<`void`\>

#### Returns

`void`

### projectRoot?

> `optional` **projectRoot?**: `string`

Optional project root directory. Defaults to `process.cwd()`.

### snapshotDir?

> `optional` **snapshotDir?**: `string`

Internal run-scoped migration snapshot directory supplied by `PgVitestPlugin`.
