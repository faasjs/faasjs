[@faasjs/ant-design](../README.md) / FormSubmitProps

# Type alias: FormSubmitProps

> **FormSubmitProps**: `Object`

## Type declaration

### text?

> **text**?: `string`

Default: Submit

### to?

> **to**?: `Object`

Submit to FaasJS server.

If use onFinish, you should call submit manually.
```ts
{
  submit: {
    to: {
      action: 'action_name'
    }
  },
  onFinish: (values, submit) => {
    // do something before submit

    // submit
    await submit({
     ...values,
     extraProps: 'some extra props'
    })

    // do something after submit
  }
}
```

### to.action

> **to.action**: `string`

### to.catch?

> **to.catch**?: (`error`) => `void`

#### Parameters

• **error**: `any`

#### Returns

`void`

### to.finally?

> **to.finally**?: () => `void`

#### Returns

`void`

### to.params?

> **to.params**?: `Record`\<`string`, `any`\>

params will overwrite form values before submit

### to.then?

> **to.then**?: (`result`) => `void`

#### Parameters

• **result**: `any`

#### Returns

`void`
