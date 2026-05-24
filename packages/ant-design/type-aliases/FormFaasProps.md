[@faasjs/ant-design](../README.md) / FormFaasProps

# Type Alias: FormFaasProps\<Values, Path\>

> **FormFaasProps**\<`Values`, `Path`\> = `object`

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

### Path

`Path` _extends_ `FaasActionPaths` = `any`

## Properties

### action

> **action**: `Path`

### onError?

> `optional` **onError?**: (`error`, `values`) => `void`

#### Parameters

##### error

`any`

##### values

`Record`\<`string`, `any`\>

#### Returns

`void`

### onFinally?

> `optional` **onFinally?**: () => `void`

#### Returns

`void`

### onSuccess?

> `optional` **onSuccess?**: (`result`, `values`) => `void`

#### Parameters

##### result

`any`

##### values

`Record`\<`string`, `any`\>

#### Returns

`void`

### params?

> `optional` **params?**: `FaasParams`\<`Path`\> \| ((`values`) => `FaasParams`\<`Path`\>)

### transformValues?

> `optional` **transformValues?**: (`values`) => `Record`\<`string`, `any`\> \| `Promise`\<`Record`\<`string`, `any`\>\>

#### Parameters

##### values

`Values`

#### Returns

`Record`\<`string`, `any`\> \| `Promise`\<`Record`\<`string`, `any`\>\>
