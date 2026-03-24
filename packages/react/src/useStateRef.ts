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
 * @param initialValue - Initial state value. When omitted, state starts as `null`.
 * @returns Tuple containing the current state, the state setter, and a ref that always points at the latest state.
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
export function useStateRef<T = any>(
  initialValue?: T,
): [T | null, Dispatch<SetStateAction<T | null>>, RefObject<T | null>] {
  const [state, setState] = useState<T | null>(initialValue ?? null)
  const ref = useRef(state)

  useEffect(() => {
    ref.current = state
  }, [state])

  return [state, setState, ref]
}
