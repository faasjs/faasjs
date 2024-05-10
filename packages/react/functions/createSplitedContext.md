[@faasjs/react](../README.md) / createSplitedContext

# Function: createSplitedContext()

> **createSplitedContext**\<`T`\>(`defaultValue`): `object`

Creates a splited context with the given default value.

## Type parameters

• **T** *extends* `Record`\<`string`, `any`\>

## Parameters

• **defaultValue**: \{ [K in string \| number \| symbol]: Partial\<T[K]\> \}

## Returns

`object`

### Provider()

> **Provider**: (`props`) => `ReactNode`

#### Parameters

• **props**

• **props.children**: `ReactNode`

• **props.value?**: `Partial`\<`T`\>

#### Returns

`ReactNode`

### use()

> **use**: () => `Readonly`\<`T`\>

#### Returns

`Readonly`\<`T`\>

## Example

```tsx
const { Provider, use } = createSplitedContext<{
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
