[@faasjs/react](../README.md) / FormProps

# Type Alias: FormProps\<Values, FormElements\>

> **FormProps**\<`Values`, `FormElements`\>: `object`

## Type Parameters

• **Values** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

• **FormElements** *extends* [`FormElementTypes`](FormElementTypes.md) = [`FormElementTypes`](FormElementTypes.md)

## Type declaration

### defaultValues?

> `optional` **defaultValues**: `Values`

### elements?

> `optional` **elements**: `FormElements`

### items

> **items**: `FormLabelElementProps`[]

### onSubmit()?

> `optional` **onSubmit**: (`values`) => `Promise`\<`void`\>

#### Parameters

• **values**: `Values`

#### Returns

`Promise`\<`void`\>
