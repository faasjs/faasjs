[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / FormCommonProps

# Type Alias: FormCommonProps\<Values, ExtendItemProps\>

> **FormCommonProps**\<`Values`, `ExtendItemProps`> > > > \> = `Omit`\<`AntdFormProps`\<`Values`>>>>\>, `"onFinish"` \| `"children"` \| `"initialValues"`> > > > \> & `object`

Shared props used by both Faas-backed and manually-submitted forms.

## Type Declaration

### beforeItems?

> `optional` **beforeItems?**: `JSX.Element` \| `JSX.Element`[]

Elements rendered before the form items.

### children?

> `optional` **children?**: `ReactNode`

Arbitrary children rendered between items and the submit button.

### extendTypes?

> `optional` **extendTypes?**: [`ExtendTypes`](ExtendTypes.md)

Custom type renderers keyed by item type.

### footer?

> `optional` **footer?**: `JSX.Element` \| `JSX.Element`[]

Elements rendered after the submit button.

### initialValues?

> `optional` **initialValues?**: `Partial`\<`Values`>>>>\>

Initial field values for the form.

### items?

> `optional` **items?**: (`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) ? `ExtendItemProps` \| [`FormItemProps`](../interfaces/FormItemProps.md) : [`FormItemProps`](../interfaces/FormItemProps.md) \| `JSX.Element`)[]

Item definitions rendered as form fields.

### submit?

> `optional` **submit?**: `false` \| [`FormSubmitProps`](FormSubmitProps.md)

Submit button config, or `false` to hide the built-in submit button.

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\>

Form values shape.

### ExtendItemProps

`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) = [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md)

Additional item prop shape accepted by `items`.
