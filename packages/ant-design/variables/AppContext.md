[@faasjs/ant-design](../README.md) / AppContext

# Variable: AppContext

> `const` **AppContext**: `object`

Shared context storing message, notification, modal, and drawer helpers.

## Type Declaration

### use

> **use**: \<`NewT`\>(`this`) => `Readonly`\<`NewT`\>

Hook used to read values from the splitting context.

#### Type Parameters

##### NewT

`NewT` _extends_ [`useAppProps`](../interfaces/useAppProps.md) = [`useAppProps`](../interfaces/useAppProps.md)

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

`NewT` _extends_ [`useAppProps`](../interfaces/useAppProps.md) = [`useAppProps`](../interfaces/useAppProps.md)

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

```ts
const { message } = AppContext.use()
```
