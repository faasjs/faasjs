[@faasjs/react](../README.md) / useEqualMemo

# Function: useEqualMemo()

> **useEqualMemo**\<`T`\>(`callback`, `dependencies`): `T`

Custom hook that works like `useMemo` but uses deep comparison on dependencies.

## Type Parameters

• **T**

## Parameters

• **callback**

The callback function to run.

• **dependencies**: `any`[]

The list of dependencies.

## Returns

`T`

The result of the `useMemo` hook with memoized dependencies.
