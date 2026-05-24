[@faasjs/ant-design](../README.md) / FormWithoutFaasProps

# Type Alias: FormWithoutFaasProps\<Values, ExtendItemProps\>

> **FormWithoutFaasProps**\<`Values`, `ExtendItemProps`\> = `FormCommonProps`\<`Values`, `ExtendItemProps`\> & `object`

Props for [Form](../functions/Form.md) when used without the built-in FaasJS submit handler.

## Type Declaration

### faas?

> `optional` **faas?**: `never`

### onFinish?

> `optional` **onFinish?**: (`values`) => `void` \| `Promise`\<`void`\>

Custom submit handler used instead of the built-in FaasJS submit flow.

#### Parameters

##### values

`Values`

#### Returns

`void` \| `Promise`\<`void`\>

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape.

### ExtendItemProps

`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) = [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md)

Additional item prop shape accepted by `items`.

## Example

```tsx
import { Form, type FormWithoutFaasProps } from '@faasjs/ant-design'

export function ProfileForm() {
  return (
    <Form
      items={[
        { id: 'name', required: true },
        { id: 'email', required: true },
      ]}
      onFinish={async (values) => {
        console.log(values)
      }}
    />
  )
}
```
