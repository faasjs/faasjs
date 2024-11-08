[@faasjs/react](../README.md) / FormItemProps

# Type Alias: FormItemProps\<FormElements, FormRulesOptions\>

> **FormItemProps**\<`FormElements`, `FormRulesOptions`\>: `object`

## Type Parameters

• **FormElements** *extends* [`FormElementTypes`](FormElementTypes.md) = [`FormElementTypes`](FormElementTypes.md)

• **FormRulesOptions** *extends* `Record`\<`string`, `any`\> = [`FormDefaultRulesOptions`](FormDefaultRulesOptions.md)

## Type declaration

### input?

> `optional` **input**: `FormInputProps`\<`FormElements`\>

### label?

> `optional` **label**: `Omit`\<[`FormLabelElementProps`](FormLabelElementProps.md), `"name"`\> & `object`

#### Type declaration

##### Label?

> `optional` **Label**: `ComponentType`\<[`FormLabelElementProps`](FormLabelElementProps.md)\>

### name

> **name**: [`FormItemName`](FormItemName.md)

### rules?

> `optional` **rules**: `FormRulesOptions`
