[@faasjs/react](../README.md) / FormContextProvider

# Function: FormContextProvider()

> **FormContextProvider**\<`NewT`\>(`props`): `ReactNode`

The provider component of the splitting context.

## Type Parameters

• **NewT** *extends* [`FormContextProps`](../type-aliases/FormContextProps.md)\<`Record`\<`string`, `any`\>\> = [`FormContextProps`](../type-aliases/FormContextProps.md)\<`Record`\<`string`, `any`\>\>

## Parameters

• **props**

• **props.children**: `ReactNode`

• **props.memo?**: `true` \| `any`[]

Whether to use memoization for the children.

**Default**

false

`true`: memoize the children without dependencies.
`any[]`: memoize the children with specific dependencies.

• **props.value?**: `NewT`

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
