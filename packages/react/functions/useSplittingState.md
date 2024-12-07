[@faasjs/react](../README.md) / useSplittingState

# Function: useSplittingState()

> **useSplittingState**\<`T`\>(`initialStates`): `StatesWithSetters`\<`T`\>

A hook that initializes and splits state variables and their corresponding setters.

## Type Parameters

• **T** *extends* `Record`\<`string`, `unknown`\>

A generic type that extends a record with string keys and any values.

## Parameters

### initialStates

`T`

An object containing the initial states.

## Returns

`StatesWithSetters`\<`T`\>

## Example

```tsx
function Counter() {
  const { count, setCount, name, setName } = useSplittingState({ count: 0, name: 'John' });

  return <>{name}: {count}</>
}
```
