[@faasjs/react](../README.md) / FormContextProvider

# Function: FormContextProvider()

> **FormContextProvider**\<`NewT`\>(`props`): `ReactNode`

The provider component of the splitting context.

## Type Parameters

• **NewT** *extends* [`FormContextProps`](../type-aliases/FormContextProps.md)\<`Record`\<`string`, `any`\>, [`FormRules`](../type-aliases/FormRules.md)\> = [`FormContextProps`](../type-aliases/FormContextProps.md)\<`Record`\<`string`, `any`\>, [`FormRules`](../type-aliases/FormRules.md)\>

## Parameters

• **props**

• **props.children**: `ReactNode`

• **props.initializeStates?**: `Partial`\<`NewT`\>

An object containing initial values that will be automatically converted into state variables using [useSplittingState](useSplittingState.md) hook. Each property will create both a state value and its setter following the pattern: value/setValue.

**Example**

```tsx
<Provider
 initializeStates={{
   value: 0,
 }}
>
  // Children will have access to: value, setValue
</Provider>

• **props.memo?**: `true` \| `any`[]

Whether to use memoization for the children.

**Default**

false

`true`: memoize the children without dependencies.
`any[]`: memoize the children with specific dependencies.

• **props.value?**: `Partial`\<`NewT`\>

## Returns

`ReactNode`

## See

https://faasjs.com/doc/react/functions/createSplittingContext.html#provider

## Example

```tsx
function App() {
  const [value, setValue] = useState(0)

  return (
    <Provider value={{ value, setValue }}>
      <ReaderComponent />
      <WriterComponent />
    </Provider>
  )
}
```
