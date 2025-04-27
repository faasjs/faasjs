[@faasjs/react](../README.md) / FormRule

# Type Alias: FormRule()\<Options\>

> **FormRule**\<`Options`\> = (`value`, `options?`, `lang?`) => `Promise`\<`void`\>

A type representing a form validation rule.

## Type Parameters

### Options

`Options` = `any`

The type of the options that can be passed to the rule.

## Parameters

### value

`any`

The value to be validated.

### options?

`Options`

Optional. Additional options that can be used in the validation.

### lang?

[`FormLang`](FormLang.md)

Optional. The language settings that can be used in the validation.

## Returns

`Promise`\<`void`\>

A promise that resolves if the validation is successful, or rejects with an error if the validation fails.

## Example

```ts
async function required(value: any, options: boolean, lang?: FormLang) {
  if (value === null || value === undefined || value === '' || Number.isNaN(value))
    throw Error(lang?.required)
}
```
