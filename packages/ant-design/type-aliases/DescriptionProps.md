[@faasjs/ant-design](../README.md) / DescriptionProps

# Type Alias: DescriptionProps\<T, ExtendItemProps\>

> **DescriptionProps**\<`T`, `ExtendItemProps`\> = [`DescriptionWithoutFaasProps`](../interfaces/DescriptionWithoutFaasProps.md)\<`T`, `ExtendItemProps`\> \| [`DescriptionWithFaasProps`](../interfaces/DescriptionWithFaasProps.md)\<`any`, `T`, `ExtendItemProps`\>

Props for the [Description](../functions/Description.md) component.

Union of [DescriptionWithoutFaasProps](../interfaces/DescriptionWithoutFaasProps.md) and [DescriptionWithFaasProps](../interfaces/DescriptionWithFaasProps.md) for backward compatibility.

## Type Parameters

### T

`T` = `any`

Data record shape rendered by the component.

### ExtendItemProps

`ExtendItemProps` = `any`

Additional item prop shape accepted by `items`.
