[@faasjs/ant-design](../README.md) / FormSubmitProps

# Type Alias: FormSubmitProps

> **FormSubmitProps** = `object`

## Properties

### text?

> `optional` **text**: `string`

Default: Submit

### to?

> `optional` **to**: `object`

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

#### action

> **action**: `FaasAction` \| `string`

#### catch()?

> `optional` **catch**: (`error`) => `void`

##### Parameters

###### error

`any`

##### Returns

`void`

#### finally()?

> `optional` **finally**: () => `void`

##### Returns

`void`

#### params?

> `optional` **params**: `Record`\<`string`, `any`\>

params will overwrite form values before submit

#### then()?

> `optional` **then**: (`result`) => `void`

##### Parameters

###### result

`any`

##### Returns

`void`
