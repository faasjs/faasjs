[@faasjs/ant-design](../README.md) / FormWithFaasProps

# Type Alias: FormWithFaasProps\<Path, Values, ExtendItemProps\>

> **FormWithFaasProps**\<`Path`, `Values`, `ExtendItemProps`\> = `FormCommonProps`\<`Values`, `ExtendItemProps`\> & `object`

## Type Declaration

### faas?

> `optional` **faas?**: [`FormFaasProps`](FormFaasProps.md)\<`Values`, `Path`\>

### onFinish?

> `optional` **onFinish?**: `never`

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths` = `any`

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

### ExtendItemProps

`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) = [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md)
