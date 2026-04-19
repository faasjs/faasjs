[@faasjs/pg-dev](../README.md) / TypedPgVitestSetupRuntime

# Interface: TypedPgVitestSetupRuntime

## Properties

### beforeEach

> **beforeEach**: (`callback`) => `void`

#### Parameters

##### callback

() => `Awaitable`\<`void`\>

#### Returns

`void`

### inject

> **inject**: (`key`) => `Record`\<`string`, `string`\> \| `undefined`

#### Parameters

##### key

`"__typedPgVitestDatabaseUrls"`

#### Returns

`Record`\<`string`, `string`\> \| `undefined`
