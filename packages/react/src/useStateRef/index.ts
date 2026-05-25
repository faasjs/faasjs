import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'

/**
 * Custom hook that returns a stateful value and a ref to that value.
 *
 * @template T - The type of the value.
 * @param {T} [initialValue] - Initial state value. Defaults to `undefined`.
 * @returns {[T, Dispatch<SetStateAction<T>>, RefObject<T>]} Tuple containing the current state, the state setter, and a ref that always points at the latest state.
 *
 * @example
 * ```tsx
 * import { useStateRef } from '@faasjs/react'
 *
 * function MyComponent() {
 *   const [value, setValue, ref] = useStateRef(0)
 *
 *   return (
 *     <div>
 *       <p>Value: {value}</p>
 *       <button onClick={() => setValue(value + 1)}>Increment</button>
 *       <button onClick={() => console.log(ref.current)}>Submit</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useStateRef<T>(
  initialValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>, RefObject<T>]
export function useStateRef<T = undefined>(): [
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
  RefObject<T | undefined>,
]
export function useStateRef<T>(
  initialValue?: T | (() => T),
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, RefObject<T | undefined>] {
  const [state, setState] = useState<T | undefined>(initialValue)
  const ref = useRef(state)

  useEffect(() => {
    ref.current = state
  }, [state])

  return [state, setState, ref]
}
