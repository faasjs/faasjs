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

> **use**: \<`NewT`\>() => `Readonly`\<`NewT`\>

The hook to use the splitting context.

#### Type Parameters

• **NewT** *extends* `T` = `T`

#### Returns

`Readonly`\<`NewT`\>

#### See

https://faasjs.com/doc/react/functions/createSplittingContext.html#use

#### Example

```tsx
function ChildComponent() {
  const { value, setValue } = use()

  return <div>{value}<button onClick={() => setValue(1)}>change value</button></div>
}
```

### Provider()

The provider component of the splitting context.

#### Type Parameters

• **NewT** *extends* `Record`\<`string`, `any`\> = `T`

#### Parameters

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

#### Returns

`ReactNode`

#### See

https://faasjs.com/doc/react/functions/createSplittingContext.html#provider

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
