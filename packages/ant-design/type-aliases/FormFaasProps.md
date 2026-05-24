[@faasjs/ant-design](../README.md) / FormFaasProps

# Type Alias: FormFaasProps\<Values, Path\>

> **FormFaasProps**\<`Values`, `Path`\> = `object`

Built-in FaasJS submit handler configuration for [Form](../functions/Form.md).

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape used by submit handlers.

### Path

`Path` _extends_ `FaasActionPaths` = `any`

Action path type.

## Properties

### action

> **action**: `Path`

Action name submitted through `faas()`.

### onError?

> `optional` **onError?**: (`error`, `values`) => `void`

Callback invoked when the request fails.

#### Parameters

##### error

`any`

##### values

`Record`\<`string`, `any`\>

#### Returns

`void`

### onFinally?

> `optional` **onFinally?**: () => `void`

Callback invoked after the request settles.

#### Returns

`void`

### onSuccess?

> `optional` **onSuccess?**: (`result`, `values`) => `void`

Callback invoked when the request succeeds.

#### Parameters

##### result

`any`

##### values

`Record`\<`string`, `any`\>

#### Returns

`void`

### params?

> `optional` **params?**: `FaasParams`\<`Path`\> \| ((`values`) => `FaasParams`\<`Path`\>)

Extra params merged into the submitted payload after `transformValues` runs.

### transformValues?

> `optional` **transformValues?**: (`values`) => `Record`\<`string`, `any`\> \| `Promise`\<`Record`\<`string`, `any`\>\>

Transform form values before sending the request.

#### Parameters

##### values

`Values`

#### Returns

`Record`\<`string`, `any`\> \| `Promise`\<`Record`\<`string`, `any`\>\>
