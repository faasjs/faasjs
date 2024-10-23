import { type Dispatch, type SetStateAction, useState } from 'react'

type SetPrefix<S extends string | number | symbol> = S extends string ? (S extends `${infer First}${infer Rest}`
  ? `set${Capitalize<First>}${Rest}`
  : never) : never

type StateSetters<T> = {
  [K in keyof T as SetPrefix<K>]: Dispatch<
    SetStateAction<T[K]>
  >
}
type StatesWithSetters<T> = T & StateSetters<T>

/**
 * A hook that initializes and splits state variables and their corresponding setters.
 *
 * @template T - A generic type that extends a record with string keys and any values.
 * @param {T} initialStates - An object containing the initial states.
 *
 * @example
 * ```tsx
 * function Counter() {
 *   const { count, setCount, name, setName } = useSplittingState({ count: 0, name: 'John' });
 *
 *   return <>{name}: {count}</>
 * }
 * ```
 */
export function useSplittingState<T extends Record<string, unknown>>(
  initialStates: T
) {
  const states = {} as StatesWithSetters<T>

  for (const key of Object.keys(initialStates) as (keyof T)[]) {
    const state = useState(initialStates[key])

    Object.assign(states, { [key]: state[0], [`set${String(key).charAt(0).toUpperCase()}${String(key).slice(1)}`]: state[1] })
  }

  return states
}
