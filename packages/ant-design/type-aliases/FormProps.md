[@faasjs/ant-design](../README.md) / FormProps

# Type Alias: FormProps\<Values, ExtendItemProps\>

> **FormProps**\<`Values`, `ExtendItemProps`\> = `Omit`\<`AntdFormProps`\<`Values`\>, `"onFinish"` \| `"children"` \| `"initialValues"`\> & `object` & \{ `faas?`: [`FormFaasProps`](FormFaasProps.md)\<`Values`\>; `onFinish?`: `never`; \} \| \{ `faas?`: `never`; `onFinish?`: (`values`) => `void` \| `Promise`\<`void`\>; \}

## Type Declaration

### beforeItems?

> `optional` **beforeItems?**: `JSX.Element` \| `JSX.Element`[]

### children?

> `optional` **children?**: `ReactNode`

### extendTypes?

> `optional` **extendTypes?**: [`ExtendTypes`](ExtendTypes.md)

### footer?

> `optional` **footer?**: `JSX.Element` \| `JSX.Element`[]

### initialValues?

> `optional` **initialValues?**: `Partial`\<`Values`\>

### items?

> `optional` **items?**: (`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) ? `ExtendItemProps` \| [`FormItemProps`](../interfaces/FormItemProps.md) : [`FormItemProps`](../interfaces/FormItemProps.md) \| `JSX.Element`)[]

### submit?

> `optional` **submit?**: `false` \| [`FormSubmitProps`](FormSubmitProps.md)

Default: { text: 'Submit' }, set false to disable it

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

### ExtendItemProps

`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) = [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md)
