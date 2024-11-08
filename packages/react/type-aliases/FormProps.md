[@faasjs/react](../README.md) / FormProps

# Type Alias: FormProps\<Values, FormElements, Rules\>

> **FormProps**\<`Values`, `FormElements`, `Rules`\>: `object`

## Type Parameters

• **Values** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

• **FormElements** *extends* [`FormElementTypes`](FormElementTypes.md) = [`FormElementTypes`](FormElementTypes.md)

• **Rules** *extends* [`FormRules`](FormRules.md) = *typeof* [`FormDefaultRules`](../variables/FormDefaultRules.md)

## Type declaration

### defaultValues?

> `optional` **defaultValues**: `Values`

### Elements?

> `optional` **Elements**: `Partial`\<`FormElements`\>

### items

> **items**: [`FormItemProps`](FormItemProps.md)\<`FormElements`, [`InferFormRulesOptions`](InferFormRulesOptions.md)\<`Rules`\>\>[]

### lang?

> `optional` **lang**: `Partial`\<[`FormLang`](FormLang.md)\>

### onSubmit()?

> `optional` **onSubmit**: (`values`) => `Promise`\<`void`\>

#### Parameters

• **values**: `Values`

#### Returns

`Promise`\<`void`\>

### rules?

> `optional` **rules**: *typeof* [`FormDefaultRules`](../variables/FormDefaultRules.md) & `Rules`
