[@faasjs/ant-design](../README.md) / FormProps

# Interface: FormProps\<Values, ExtendItemProps\>

## Extends

- `Omit`\<`AntdFormProps`\<`Values`\>, `"onFinish"` \| `"children"` \| `"initialValues"`\>

## Type parameters

• **Values** extends `Record`\<`string`, `any`\> = `any`

• **ExtendItemProps** = `any`

## Properties

### beforeItems?

> **beforeItems**?: `Element` \| `Element`[]

### children?

> **children**?: `ReactNode`

### extendTypes?

> **extendTypes**?: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

### footer?

> **footer**?: `Element` \| `Element`[]

### initialValues?

> **initialValues**?: `Values`

### items?

> **items**?: (`Element` \| [`FormItemProps`](FormItemProps.md)\<`any`\> \| `ExtendItemProps`)[]

### onFinish?

> **onFinish**?: (`values`, `submit`?) => `Promise`\<`any`\>

#### Parameters

• **values**: `Values`

• **submit?**: (`values`) => `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

### submit?

> **submit**?: `false` \| [`FormSubmitProps`](../type-aliases/FormSubmitProps.md)

Default: { text: 'Submit' }, set false to disable it
