[@faasjs/ant-design](../README.md) / FormWithoutFaasProps

# Type Alias: FormWithoutFaasProps\<Values, ExtendItemProps\>

> **FormWithoutFaasProps**\<`Values`, `ExtendItemProps`> > > > \> = [`FormCommonProps`](FormCommonProps.md)\<`Values`, `ExtendItemProps`> > > > \> & `object`

Props for the [Form](../functions/Form.md) component when NO FaasJS integration is used.

## Type Declaration

### faas?

> `optional` **faas?**: `never`

Must not be set when using a custom `onFinish` handler.

### onFinish?

> `optional` **onFinish?**: (`values`) => `void` \| `Promise`\<`void`>>>>\>

Custom submit handler that replaces the built-in FaasJS flow.

#### Parameters

##### values

`Values`

#### Returns

`void` \| `Promise`\<`void`\>

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape.

### ExtendItemProps

`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) = [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md)

Additional item prop shape accepted by `items`.
