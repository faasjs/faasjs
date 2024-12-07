[@faasjs/react](../README.md) / useEqualEffect

# Function: useEqualEffect()

> **useEqualEffect**(`callback`, `dependencies`): `void`

Custom hook that works like `useEffect` but uses deep comparison on dependencies.

## Parameters

### callback

`EffectCallback`

The effect callback function to run.

### dependencies

`any`[]

The list of dependencies for the effect.

## Returns

`void`

The result of the `useEffect` hook with memoized dependencies.
