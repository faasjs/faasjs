[**@faasjs/core**](../README.md)

[@faasjs/core](../README.md) / RuntimeContext

# Type Alias: RuntimeContext

> **RuntimeContext** = `object`

Framework-managed context fields shared with plugins and handlers.

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### request\_at?

> `optional` **request\_at?**: `string`

Request creation marker used by logs and plugin labels.

### request\_id?

> `optional` **request\_id?**: `string`

Request-scoped id used by logs and plugin labels.

### runtime?

> `optional` **runtime?**: [`FuncRuntime`](FuncRuntime.md)

Runtime family currently executing the function.
