# Namespace: Form

## Table of contents

### Variables

- [Item](Form.md#item)
- [useForm](Form.md#useform)

## Variables

### Item

• **Item**: <T\>(`props`: [`FormItemProps`](../modules.md#formitemprops)<`T`\>) => `Element`

#### Type declaration

▸ <`T`\>(`props`): `Element`

FormItem, can be used without Form.
Example:
```ts
// use inline type
<FormItem item={{ type: 'string', id: 'name' }} />

// use custom type
<FormItem item={{ id: 'password' }}>
  <Input.Password />
</>
```

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`FormItemProps`](../modules.md#formitemprops)<`T`\> |

##### Returns

`Element`

___

### useForm

• **useForm**: <Values\>(`form?`: `FormInstance`<`Values`\>) => [`FormInstance`<`Values`\>]

#### Type declaration

▸ <`Values`\>(`form?`): [`FormInstance`<`Values`\>]

##### Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | `any` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `form?` | `FormInstance`<`Values`\> |

##### Returns

[`FormInstance`<`Values`\>]
