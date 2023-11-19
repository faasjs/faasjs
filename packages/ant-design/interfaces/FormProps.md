# Interface: FormProps\<Values, ExtendItemProps\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `Values` | extends `Record`\<`string`, `any`\> = `any` |
| `ExtendItemProps` | `any` |

## Hierarchy

- `Omit`\<`AntdFormProps`\<`Values`\>, ``"onFinish"`` \| ``"children"`` \| ``"initialValues"``\>

  ↳ **`FormProps`**

## Table of contents

### Properties

- [beforeItems](FormProps.md#beforeitems)
- [children](FormProps.md#children)
- [extendTypes](FormProps.md#extendtypes)
- [footer](FormProps.md#footer)
- [initialValues](FormProps.md#initialvalues)
- [items](FormProps.md#items)
- [onFinish](FormProps.md#onfinish)
- [submit](FormProps.md#submit)

## Properties

### beforeItems

• `Optional` **beforeItems**: `Element` \| `Element`[]

___

### children

• `Optional` **children**: `ReactNode`

___

### extendTypes

• `Optional` **extendTypes**: [`ExtendTypes`](../modules.md#extendtypes)

___

### footer

• `Optional` **footer**: `Element` \| `Element`[]

___

### initialValues

• `Optional` **initialValues**: `Values`

___

### items

• `Optional` **items**: (`Element` \| [`FormItemProps`](FormItemProps.md)\<`any`\> \| `ExtendItemProps`)[]

___

### onFinish

• `Optional` **onFinish**: (`values`: `Values`, `submit?`: (`values`: `any`) => `Promise`\<`any`\>) => `Promise`\<`any`\>

#### Type declaration

▸ (`values`, `submit?`): `Promise`\<`any`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Values` |
| `submit?` | (`values`: `any`) => `Promise`\<`any`\> |

##### Returns

`Promise`\<`any`\>

___

### submit

• `Optional` **submit**: ``false`` \| [`FormSubmitProps`](../modules.md#formsubmitprops)

Default: { text: 'Submit' }, set false to disable it
