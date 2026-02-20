[@faasjs/react](../README.md) / FormContextProvider

# Variable: FormContextProvider()

> `const` **FormContextProvider**: \<`NewT`\>(`props`) => `ReactNode` = `FormContext.Provider`

The provider component of the splitting context.

## Type Parameters

### NewT

`NewT` *extends* [`FormContextProps`](../type-aliases/FormContextProps.md)\<`Record`\<`string`, `any`\>, [`FormElementTypes`](../type-aliases/FormElementTypes.md), [`FormRules`](../type-aliases/FormRules.md)\> = [`FormContextProps`](../type-aliases/FormContextProps.md)\<`Record`\<`string`, `any`\>, [`FormElementTypes`](../type-aliases/FormElementTypes.md), [`FormRules`](../type-aliases/FormRules.md)\>

## Parameters

### props

#### children

`ReactNode`

#### initializeStates?

`Partial`\<`NewT`\>

An object containing initial values that will be automatically converted into state variables using [useSplittingState](../functions/useSplittingState.md) hook. Each property will create both a state value and its setter following the pattern: value/setValue.

**Example**

```tsx
<Provider
 initializeStates={{
   value: 0,
 }}
>
  // Children will have access to: value, setValue
</Provider>

#### memo?

`true` \| `any`[]

Whether to use memoization for the children.

**Default**

false

`true`: memoize the children without dependencies.
`any[]`: memoize the children with specific dependencies.

#### value?

`Partial`\<`NewT`\>

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
