[@faasjs/react](../README.md) / createSplittingContext

# Function: createSplittingContext()

> **createSplittingContext**\<`T`\>(`defaultValue`): `object`

Create a context whose keys can be consumed independently.

`createSplittingContext` returns a `Provider` and a `use` hook. Each key in
the provided shape is backed by a separate React context so readers only
subscribe to the values they access.

## Type Parameters

### T

`T` _extends_ `Record`\<`string`, `any`\>

Context value shape exposed by the provider and hook.

## Parameters

### defaultValue

\{ \[K in string \| number \| symbol\]: Partial\<T\[K\]\> \| null \} \| keyof `T`[]

Default value map or key list used to create split contexts.

## Returns

Provider and hook helpers for the split context.

### use

> **use**: \<`NewT`\>(`this`) => `Readonly`\<`NewT`\>

Hook used to read values from the splitting context.

#### Type Parameters

##### NewT

`NewT` _extends_ `Record`\<`string`, `any`\> = `T`

#### Parameters

##### this

`void`

#### Returns

`Readonly`\<`NewT`\>

#### See

[Hook docs](https://faasjs.com/doc/react/functions/createSplittingContext.html#use)

#### Example

```tsx
function ChildComponent() {
  const { value, setValue } = use()

  return (
    <div>
      {value}
      <button onClick={() => setValue(1)}>change value</button>
    </div>
  )
}
```

### Provider()

> **Provider**\<`NewT`\>(`this`, `props`): `ReactNode`

The provider component of the splitting context.

#### Type Parameters

##### NewT

`NewT` _extends_ `Record`\<`string`, `any`\> = `T`

#### Parameters

##### this

`void`

##### props

###### children

`ReactNode`

Descendant elements that should read from the split contexts.

###### initializeStates?

`Partial`\<`NewT`\>

Initial values converted into local state via `useSplittingState`.

Each key produces both a state value and its matching setter using the
`value` / `setValue` naming convention.

**Example**

```tsx
<Provider initializeStates={{ value: 0 }}>
  <Child />
</Provider>

// `Child` can read `value` and `setValue`
```

###### memo?

`true` \| `any`[]

Memoization mode for `children`.

**Default**

false

Pass `true` to memoize without dependencies or an array to control the
deep-equality dependency list manually.

###### value?

`Partial`\<`NewT`\>

Partial context value supplied by the caller.

#### Returns

`ReactNode`

#### See

[Provider docs](https://faasjs.com/doc/react/functions/createSplittingContext.html#provider)

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
    <button type="button" onClick={() => setValue((p: number) => p + 1)}>
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
