[@faasjs/ant-design](../README.md) / FormFaasProps

# Type Alias: FormFaasProps\<Values\>

> **FormFaasProps**\<`Values`\> = `object`

Built-in FaasJS submit handler for Form.

## Example

```ts
{
  action: 'user/create',
  params: (values) => ({
    ...values,
    role: values.role || 'user',
  }),
  onSuccess: (result) => {
    console.log(result)
  },
}
```

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape used by submit handlers.

## Properties

### action

> **action**: `FaasAction`

Action name to submit to

### onError?

> `optional` **onError?**: (`error`, `values`) => `void`

Called when the request fails

#### Parameters

##### error

`any`

##### values

`Record`\<`string`, `any`\>

#### Returns

`void`

### onFinally?

> `optional` **onFinally?**: () => `void`

Called after the request settles

#### Returns

`void`

### onSuccess?

> `optional` **onSuccess?**: (`result`, `values`) => `void`

Called when the request succeeds

#### Parameters

##### result

`any`

##### values

`Record`\<`string`, `any`\>

#### Returns

`void`

### params?

> `optional` **params?**: `Record`\<`string`, `any`\> \| ((`values`) => `Record`\<`string`, `any`\>)

params will overwrite form values before submit

### transformValues?

> `optional` **transformValues?**: (`values`) => `Record`\<`string`, `any`\> \| `Promise`\<`Record`\<`string`, `any`\>\>

Transform form values before sending the request

#### Parameters

##### values

`Values`

#### Returns

`Record`\<`string`, `any`\> \| `Promise`\<`Record`\<`string`, `any`\>\>
