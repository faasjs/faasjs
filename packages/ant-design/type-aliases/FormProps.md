[@faasjs/ant-design](../README.md) / FormProps

# Type Alias: FormProps\<Values, Path, ExtendItemProps\>

> **FormProps**\<`Values`, `Path`, `ExtendItemProps`\> = [`FormWithoutFaasProps`](FormWithoutFaasProps.md)\<`Values`, `ExtendItemProps`\> \| [`FormWithFaasProps`](FormWithFaasProps.md)\<`Path`, `Values`, `ExtendItemProps`\>

Props for the FaasJS Ant Design [Form](../functions/Form.md) component.

Union of [FormWithoutFaasProps](FormWithoutFaasProps.md) and [FormWithFaasProps](FormWithFaasProps.md) for backward compatibility.

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape.

### Path

`Path` _extends_ `FaasActionPaths` = `any`

Action path type.

### ExtendItemProps

`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) = [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md)

Additional item prop shape accepted by `items`.
