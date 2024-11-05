[@faasjs/react](../README.md) / FormProps

# Type Alias: FormProps\<Values, FormElements, Rules\>

> **FormProps**\<`Values`, `FormElements`, `Rules`\>: `object`

## Type Parameters

• **Values** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

• **FormElements** *extends* [`FormElementTypes`](FormElementTypes.md) = [`FormElementTypes`](FormElementTypes.md)

• **Rules** *extends* `FormRules` = *typeof* `FormDefaultRules`

## Type declaration

### defaultValues?

> `optional` **defaultValues**: `Values`

### Elements?

> `optional` **Elements**: `Partial`\<`FormElements`\>

### items

> **items**: [`FormLabelElementProps`](FormLabelElementProps.md)\<`FormElements`, `InferFormRulesOptions`\<`Rules`\>\>[]

### lang?

> `optional` **lang**: `Partial`\<`FormLang`\>

### onSubmit()?

> `optional` **onSubmit**: (`values`) => `Promise`\<`void`\>

#### Parameters

• **values**: `Values`

#### Returns

`Promise`\<`void`\>

### rules?

> `optional` **rules**: *typeof* `FormDefaultRules` & `Rules`
