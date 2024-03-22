[@faasjs/ant-design](../README.md) / FormSubmitProps

# Type alias: FormSubmitProps

> **FormSubmitProps**: `Object`

## Type declaration

### text?

> **`optional`** **text**: `string`

Default: Submit

### to?

> **`optional`** **to**: `Object`

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

> **action**: `string`

### to.catch()?

> **`optional`** **catch**: (`error`) => `void`

#### Parameters

• **error**: `any`

#### Returns

`void`

### to.finally()?

> **`optional`** **finally**: () => `void`

#### Returns

`void`

### to.params?

> **`optional`** **params**: `Record`\<`string`, `any`\>

params will overwrite form values before submit

### to.then()?

> **`optional`** **then**: (`result`) => `void`

#### Parameters

• **result**: `any`

#### Returns

`void`
