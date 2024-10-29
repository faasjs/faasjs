[@faasjs/react](../README.md) / FormContextProps

# Type Alias: FormContextProps\<Values\>

> **FormContextProps**\<`Values`\>: `object`

## Type Parameters

• **Values** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

## Type declaration

### Elements

> **Elements**: [`FormElementTypes`](FormElementTypes.md)

### items

> **items**: `FormLabelElementProps`[]

### onSubmit()

> **onSubmit**: (`values`) => `Promise`\<`void`\>

#### Parameters

• **values**: `Values`

#### Returns

`Promise`\<`void`\>

### setSubmitting

> **setSubmitting**: `React.Dispatch`\<`React.SetStateAction`\<`boolean`\>\>

### setValues

> **setValues**: `React.Dispatch`\<`React.SetStateAction`\<`Values`\>\>

### submitting

> **submitting**: `boolean`

### values

> **values**: `Values`
