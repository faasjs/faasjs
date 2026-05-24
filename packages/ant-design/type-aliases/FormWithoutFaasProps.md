[@faasjs/ant-design](../README.md) / FormWithoutFaasProps

# Type Alias: FormWithoutFaasProps\<Values, ExtendItemProps\>

> **FormWithoutFaasProps**\<`Values`, `ExtendItemProps`\> = `FormCommonProps`\<`Values`, `ExtendItemProps`\> & `object`

## Type Declaration

### faas?

> `optional` **faas?**: `never`

### onFinish?

> `optional` **onFinish?**: (`values`) => `void` \| `Promise`\<`void`\>

#### Parameters

##### values

`Values`

#### Returns

`void` \| `Promise`\<`void`\>

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

### ExtendItemProps

`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) = [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md)
