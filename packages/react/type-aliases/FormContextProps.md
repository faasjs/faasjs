[@faasjs/react](../README.md) / FormContextProps

# Type Alias: FormContextProps\<Values, Rules\>

> **FormContextProps**\<`Values`, `Rules`\>: `object`

## Type Parameters

• **Values** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

• **Rules** *extends* `FormRules` = *typeof* `FormDefaultRules`

## Type declaration

### Elements

> **Elements**: [`FormElementTypes`](FormElementTypes.md)

### errors

> **errors**: `Record`\<`string`, `FormError`\>

### items

> **items**: [`FormLabelElementProps`](FormLabelElementProps.md)[]

### lang

> **lang**: `FormLang`

### onSubmit()

> **onSubmit**: (`values`) => `Promise`\<`void`\>

#### Parameters

• **values**: `Values`

#### Returns

`Promise`\<`void`\>

### rules

> **rules**: *typeof* `FormDefaultRules` & `Rules`

### setErrors

> **setErrors**: `Dispatch`\<`SetStateAction`\<`Record`\<`string`, `FormError`\>\>\>

### setSubmitting

> **setSubmitting**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

### setValues

> **setValues**: `Dispatch`\<`SetStateAction`\<`Values`\>\>

### submitting

> **submitting**: `boolean`

### values

> **values**: `Values`
