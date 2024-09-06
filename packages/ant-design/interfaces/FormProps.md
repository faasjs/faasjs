[@faasjs/ant-design](../README.md) / FormProps

# Interface: FormProps\<Values, ExtendItemProps\>

## Extends

- `Omit`\<`AntdFormProps`\<`Values`\>, `"onFinish"` \| `"children"` \| `"initialValues"`\>

## Type Parameters

• **Values** *extends* `Record`\<`string`, `any`\> = `any`

• **ExtendItemProps** *extends* [`ExtendFormItemProps`](ExtendFormItemProps.md) = [`ExtendFormItemProps`](ExtendFormItemProps.md)

## Properties

### beforeItems?

> `optional` **beforeItems**: `Element` \| `Element`[]

### children?

> `optional` **children**: `ReactNode`

### extendTypes?

> `optional` **extendTypes**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

### footer?

> `optional` **footer**: `Element` \| `Element`[]

### initialValues?

> `optional` **initialValues**: `Partial`\<`Values`\>

### items?

> `optional` **items**: (`Element` \| `ExtendItemProps` *extends* [`ExtendFormItemProps`](ExtendFormItemProps.md) ? [`FormItemProps`](FormItemProps.md)\<`any`\> \| `ExtendItemProps`\<`ExtendItemProps`\> : [`FormItemProps`](FormItemProps.md)\<`any`\>)[]

### onFinish()?

> `optional` **onFinish**: (`values`, `submit`?) => `Promise`\<`any`\>

#### Parameters

• **values**: `Values`

• **submit?**

#### Returns

`Promise`\<`any`\>

### submit?

> `optional` **submit**: `false` \| [`FormSubmitProps`](../type-aliases/FormSubmitProps.md)

Default: { text: 'Submit' }, set false to disable it
