[@faasjs/react](../README.md) / StateSetters

# Type Alias: StateSetters\<T\>

> **StateSetters**\<`T`\> = `` { [K in keyof T as K extends string ? K extends `${infer First}${infer Rest}` ? `set${Capitalize<First>}${Rest}` : never : never]: Dispatch<SetStateAction<T[K]>> } ``

## Type Parameters

### T

`T`
