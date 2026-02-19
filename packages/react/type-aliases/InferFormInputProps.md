[@faasjs/react](../README.md) / InferFormInputProps

# Type Alias: InferFormInputProps\<T\>

> **InferFormInputProps**\<`T`\> = `T` _extends_ `ComponentType`\<[`FormInputElementProps`](FormInputElementProps.md)\> ? `Omit`\<`ComponentProps`\<`T`\>, `"name"` \| `"value"` \| `"onChange"`\> : `Omit`\<`ComponentProps`\<`T`\>, `"name"` \| `"value"`\>

## Type Parameters

### T

`T` _extends_ `ComponentType`\<[`FormInputElementProps`](FormInputElementProps.md)\> \| `JSXElementConstructor`\<`any`\>
