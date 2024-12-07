[@faasjs/react](../README.md) / useEqualCallback

# Function: useEqualCallback()

> **useEqualCallback**\<`T`\>(`callback`, `dependencies`): `T`

Custom hook that works like `useCallback` but uses deep comparison on dependencies.

## Type Parameters

• **T** *extends* (...`args`) => `any`

## Parameters

### callback

`T`

The callback function to run.

### dependencies

`any`[]

The list of dependencies.

## Returns

`T`

The result of the `useCallback` hook with memoized dependencies.
