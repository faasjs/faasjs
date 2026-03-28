[@faasjs/ant-design](../README.md) / FormProps

# Type Alias: FormProps\<Values, ExtendItemProps\>

> **FormProps**\<`Values`, `ExtendItemProps`\> = `Omit`\<`AntdFormProps`\<`Values`\>, `"onFinish"` \| `"children"` \| `"initialValues"`\> & `object` & \{ `faas?`: [`FormFaasProps`](FormFaasProps.md)\<`Values`\>; `onFinish?`: `never`; \} \| \{ `faas?`: `never`; `onFinish?`: (`values`) => `void` \| `Promise`\<`void`\>; \}

Props for the FaasJS Ant Design [Form](../functions/Form.md) component.

## Type Declaration

### beforeItems?

> `optional` **beforeItems?**: `JSX.Element` \| `JSX.Element`[]

Extra content rendered before generated items.

### children?

> `optional` **children?**: `ReactNode`

Additional custom content rendered inside the form.

### extendTypes?

> `optional` **extendTypes?**: [`ExtendTypes`](ExtendTypes.md)

Custom form item type renderers keyed by type name.

### footer?

> `optional` **footer?**: `JSX.Element` \| `JSX.Element`[]

Extra content rendered after generated items.

### initialValues?

> `optional` **initialValues?**: `Partial`\<`Values`\>

Initial values applied to the underlying Ant Design form.

### items?

> `optional` **items?**: (`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) ? `ExtendItemProps` \| [`FormItemProps`](../interfaces/FormItemProps.md) : [`FormItemProps`](../interfaces/FormItemProps.md) \| `JSX.Element`)[]

Form item definitions or custom JSX blocks rendered inside the form.

### submit?

> `optional` **submit?**: `false` \| [`FormSubmitProps`](FormSubmitProps.md)

Built-in submit button config, or `false` to disable the generated submit button.

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape.

### ExtendItemProps

`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) = [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md)

Additional item prop shape accepted by `items`.
