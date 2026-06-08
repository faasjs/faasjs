[@faasjs/ant-design](../README.md) / FormWithFaasProps

# Type Alias: FormWithFaasProps\<Path, Values, ExtendItemProps\>

> **FormWithFaasProps**\<`Path`, `Values`, `ExtendItemProps`\> = [`FormCommonProps`](FormCommonProps.md)\<`Values`, `ExtendItemProps`\> & `object`

Props for the [Form](../functions/Form.md) component when FaasJS write-action integration is used.

## Type Declaration

### faas?

> `optional` **faas?**: [`FormFaasProps`](FormFaasProps.md)\<`Values`, `Path`\>

FaasJS integration configuration.

### onFinish?

> `optional` **onFinish?**: `never`

Must not be set when `faas` is provided.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths` = `any`

Registered action path used to infer submitted params.

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape.

### ExtendItemProps

`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) = [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md)

Additional item prop shape accepted by `items`.
