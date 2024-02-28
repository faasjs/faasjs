[@faasjs/ant-design](../README.md) / FormProps

# Interface: FormProps\<Values, ExtendItemProps\>

## Extends

- `Omit`\<`AntdFormProps`\<`Values`\>, `"onFinish"` \| `"children"` \| `"initialValues"`\>

## Type parameters

• **Values** extends `Record`\<`string`, `any`\> = `any`

• **ExtendItemProps** = `any`

## Properties

### beforeItems?

> **`optional`** **beforeItems**: `Element` \| `Element`[]

### children?

> **`optional`** **children**: `ReactNode`

### extendTypes?

> **`optional`** **extendTypes**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

### footer?

> **`optional`** **footer**: `Element` \| `Element`[]

### initialValues?

> **`optional`** **initialValues**: `Values`

### items?

> **`optional`** **items**: (`Element` \| [`FormItemProps`](FormItemProps.md)\<`any`\> \| `ExtendItemProps`)[]

### onFinish?

> **`optional`** **onFinish**: (`values`, `submit`?) => `Promise`\<`any`\>

#### Parameters

• **values**: `Values`

• **submit?**

#### Returns

`Promise`\<`any`\>

### submit?

> **`optional`** **submit**: `false` \| [`FormSubmitProps`](../type-aliases/FormSubmitProps.md)

Default: \{ text: 'Submit' \}, set false to disable it
