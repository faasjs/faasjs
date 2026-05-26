[@faasjs/ant-design](../README.md) / FormFaasProps

# Type Alias: FormFaasProps\<Values, Path\>

> **FormFaasProps**\<`Values`, `Path`\> = `object`

Configures FaasJS-backed form submission.

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape.

### Path

`Path` _extends_ `FaasActionPaths` = `any`

Action path type inferred from the registered FaasJS actions.

## Properties

### action

> **action**: `Path`

Fully qualified FaasJS action path.

### onError?

> `optional` **onError?**: (`error`, `values`) => `void`

Called after a failed FaasJS request.

#### Parameters

##### error

`any`

##### values

`Record`\<`string`, `any`\>

#### Returns

`void`

### onFinally?

> `optional` **onFinally?**: () => `void`

Called after the request settles, regardless of success or failure.

#### Returns

`void`

### onSuccess?

> `optional` **onSuccess?**: (`result`, `values`) => `void`

Called after a successful FaasJS response.

#### Parameters

##### result

`any`

##### values

`Record`\<`string`, `any`\>

#### Returns

`void`

### params?

> `optional` **params?**: `FaasParams`\<`Path`\> \| ((`values`) => `FaasParams`\<`Path`\>)

Static params or a factory that receives the current form values and returns the params payload.

### transformValues?

> `optional` **transformValues?**: (`values`) => `Record`\<`string`, `any`\> \| `Promise`\<`Record`\<`string`, `any`\>\>

Transformer applied to form values before the FaasJS request is fired.

#### Parameters

##### values

`Values`

#### Returns

`Record`\<`string`, `any`\> \| `Promise`\<`Record`\<`string`, `any`\>\>
