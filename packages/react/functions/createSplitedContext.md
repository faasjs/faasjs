[@faasjs/react](../README.md) / createSplitedContext

# Function: createSplitedContext()

> **createSplitedContext**\<`T`\>(`defaultValue`): `Object`

Creates a splited context with the given default value.

## Type parameters

• **T** extends `Record`\<`string`, `any`\>

The type of the default value.

## Parameters

• **defaultValue**: `T`

The default value for the split context.

## Returns

`Object`

- An object containing the Provider and use functions.

### Provider()

> **Provider**: (`props`) => `Element`

#### Parameters

• **props**

• **props\.children**: `ReactNode`

• **props\.value**: `T`

#### Returns

`Element`

### Provider.whyDidYouRender

> **whyDidYouRender**: `boolean`

### use()

> **use**: () => `Readonly`\<`T`\>

#### Returns

`Readonly`\<`T`\>

### use.whyDidYouRender

> **whyDidYouRender**: `boolean`

## Example

```tsx
const { Provider, use } = createSplitedContext({
  value: 0,
  setValue: (_: any) => {},
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

const App = memo(() => {
  return (
    <>
      <ReaderComponent />
      <WriterComponent />
    </>
  )
})

function Container() {
  const [value, setValue] = useState(0)

  return (
    <Provider value={{ value, setValue }}>
      <App />
    </Provider>
  )
}
```
