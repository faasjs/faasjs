[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / FormFaasProps

# Type Alias: FormFaasProps\<Values, Path\>

> **FormFaasProps**\<`Values`, `Path`> > > > > > \> = `object`

Configures FaasJS-backed form submission for create/update/delete style actions.

The submitted payload starts from the current form values, optionally passes
through `transformValues`, then merges `params` over the transformed values
before calling `faas(action, payload)`.

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape.

### Path

`Path` _extends_ `FaasActionPaths` = `any`

Registered action path used to infer submitted params.

## Properties

### action

> **action**: `Path`

FaasJS action path for the write-style request.

### onError?

> `optional` **onError?**: (`error`, `values`) => `void`

Called with the request error and final submitted payload after a failed request.

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

Called with the `faas` response and final submitted payload after a successful request.

#### Parameters

##### result

`any`

##### values

`Record`\<`string`, `any`\>

#### Returns

`void`

### params?

> `optional` **params?**: `FaasParams`\<`Path`> > > > > > \> \| ((`values`) => `FaasParams`\<`Path`>>>>>>\>)

Extra static params or a factory that receives transformed form values.

Returned keys are merged over the form values, so they can provide IDs or
route metadata for update/delete flows.

### transformValues?

> `optional` **transformValues?**: (`values`) => `Record`\<`string`, `any`> > > > > > \> \| `Promise`\<`Record`\<`string`, `any`>>>>>>>>>>>>\>\>

Transformer applied before `params` are merged and before the FaasJS request is fired.

#### Parameters

##### values

`Values`

#### Returns

`Record`\<`string`, `any`\> \| `Promise`\<`Record`\<`string`, `any`\>\>
