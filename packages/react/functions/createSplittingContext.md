[@faasjs/react](../README.md) / createSplittingContext

# Function: createSplittingContext()

> **createSplittingContext**\<`T`\>(`defaultValue`): `object`

Creates a splitting context with the given default value.

## Type Parameters

• **T** *extends* `Record`\<`string`, `any`\>

## Parameters

• **defaultValue**: \{ \[K in string \| number \| symbol\]: Partial\<T\[K\]\> \} \| keyof `T`[]

The default value of the splitting context.

## Returns

`object`

### use()

> **use**: () => `Readonly`\<`T`\>

The hook to use the splitting context.

#### Returns

`Readonly`\<`T`\>

#### See

https://faasjs.com/doc/react/functions/createSplittingContext.html#use

### Provider()

The provider component of the splitting context.

#### Parameters

• **props**

• **props.children**: `ReactNode`

• **props.memo?**: `true` \| `any`[]

• **props.value?**: `Partial`\<`T`\>

#### Returns

`ReactNode`

#### See

https://faasjs.com/doc/react/functions/createSplittingContext.html#provider

## Example

```tsx
const { Provider, use } = createSplittingContext<{
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
}>({
  value: 0,
  setValue: null,
})

function ReaderComponent() {
  const { value } = use()

  return <div>{value}</div>
}

function WriterComponent() {
  const { setValue } = use()

  return (
    <button type='button' onClick={() => setValue((p: number) => p + 1)}>
      Change
    </button>
  )
}

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
