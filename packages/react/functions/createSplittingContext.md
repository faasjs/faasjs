[@faasjs/react](../README.md) / createSplittingContext

# Function: createSplittingContext()

> **createSplittingContext**\<`T`\>(`defaultValue`): `object`

Creates a splitting context with the given default value.

## Type Parameters

• **T** *extends* `Record`\<`string`, `any`\>

## Parameters

• **defaultValue**: \{ \[K in string \| number \| symbol\]: Partial\<T\[K\]\> \}

The default value of the splitting context.

## Returns

`object`

The provider component and the hook to use the splitting context.

### Provider()

> **Provider**: (`props`) => `ReactNode`

The provider component of the splitting context.

#### Parameters

• **props**

• **props.children**: `ReactNode`

• **props.value?**: `Partial`\<`T`\>

#### Returns

`ReactNode`

#### Example

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

### use()

> **use**: () => `Readonly`\<`T`\>

The hook to use the splitting context.

#### Returns

`Readonly`\<`T`\>

#### Example

```tsx
function ChildComponent() {
  const { value, setValue } = use()

  return <div>{value}<button onClick={() => setValue(1)}>change value</button></div>
}
```

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
