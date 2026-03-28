[@faasjs/react](../README.md) / OptionalWrapperProps

# Type Alias: OptionalWrapperProps\<TWrapper\>

> **OptionalWrapperProps**\<`TWrapper`\> = `object`

Props for the [OptionalWrapper](../functions/OptionalWrapper.md) helper component.

## Type Parameters

### TWrapper

`TWrapper` _extends_ `ComponentType`\<\{ `children`: `ReactNode`; \}\> = `any`

Wrapper component type used when `condition` is true.

## Properties

### children

> **children**: `ReactNode`

Content rendered directly or inside the wrapper.

### condition

> **condition**: `boolean`

When `true`, render `children` inside `Wrapper`.

### Wrapper

> **Wrapper**: `TWrapper`

Wrapper component used when `condition` passes.

### wrapperProps?

> `optional` **wrapperProps?**: `ComponentProps`\<`TWrapper`\>

Props forwarded to `Wrapper` together with `children`.
