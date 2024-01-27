[@faasjs/react](../README.md) / useFaasOptions

# Type alias: useFaasOptions\<PathOrData\>

> **useFaasOptions**\<`PathOrData`\>: `Object`

## Type parameters

• **PathOrData** extends `FaasAction`

## Type declaration

### data?

> **data**?: `FaasData`\<`PathOrData`\>

### debounce?

> **debounce**?: `number`

send the last request after milliseconds

### params?

> **params**?: `FaasParams`\<`PathOrData`\>

### setData?

> **setData**?: `React.Dispatch`\<`React.SetStateAction`\<`FaasData`\<`PathOrData`\>\>\>

### skip?

> **skip**?: `boolean` \| (`params`) => `boolean`

if skip is true, will not send request
