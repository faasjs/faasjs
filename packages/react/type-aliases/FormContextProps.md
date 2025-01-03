[@faasjs/react](../README.md) / FormContextProps

# Type Alias: FormContextProps\<Values, FormElements, Rules\>

> **FormContextProps**\<`Values`, `FormElements`, `Rules`\>: `object`

## Type Parameters

• **Values** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

• **FormElements** *extends* [`FormElementTypes`](FormElementTypes.md) = [`FormElementTypes`](FormElementTypes.md)

• **Rules** *extends* [`FormRules`](FormRules.md) = *typeof* [`FormDefaultRules`](../variables/FormDefaultRules.md)

## Type declaration

### Elements

> **Elements**: [`FormElementTypes`](FormElementTypes.md)

### errors

> **errors**: `Record`\<`string`, `Error`\>

### items

> **items**: [`FormItemProps`](FormItemProps.md)\<`FormElements`, [`InferFormRulesOptions`](InferFormRulesOptions.md)\<`Rules`\>\>[]

### lang

> **lang**: [`FormLang`](FormLang.md)

### onSubmit()

> **onSubmit**: (`values`) => `Promise`\<`void`\>

#### Parameters

##### values

`Values`

#### Returns

`Promise`\<`void`\>

### rules

> **rules**: *typeof* [`FormDefaultRules`](../variables/FormDefaultRules.md) & `Rules`

### setErrors

> **setErrors**: `Dispatch`\<`SetStateAction`\<`Record`\<`string`, `Error`\>\>\>

### setSubmitting

> **setSubmitting**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

### setValues

> **setValues**: `Dispatch`\<`SetStateAction`\<`Values`\>\>

### submitting

> **submitting**: `boolean`

### values

> **values**: `Values`

### valuesRef

> **valuesRef**: `RefObject`\<`Values`\>
