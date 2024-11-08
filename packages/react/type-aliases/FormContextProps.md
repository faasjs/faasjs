[@faasjs/react](../README.md) / FormContextProps

# Type Alias: FormContextProps\<Values, Rules\>

> **FormContextProps**\<`Values`, `Rules`\>: `object`

## Type Parameters

• **Values** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

• **Rules** *extends* [`FormRules`](FormRules.md) = *typeof* [`FormDefaultRules`](../variables/FormDefaultRules.md)

## Type declaration

### Elements

> **Elements**: [`FormElementTypes`](FormElementTypes.md)

### errors

> **errors**: `Record`\<`string`, `Error`\>

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
