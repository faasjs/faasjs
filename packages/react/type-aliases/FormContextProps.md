[@faasjs/react](../README.md) / FormContextProps

# Type Alias: FormContextProps\<Values\>

> **FormContextProps**\<`Values`\>: `object`

## Type Parameters

• **Values** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

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
