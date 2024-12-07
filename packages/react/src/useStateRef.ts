import { type RefObject, useEffect, useRef, useState } from 'react'

/**
 * Custom hook that returns a stateful value and a ref to that value.
 *
 * @template T - The type of the value.
 * @param {T} initialValue - The initial value of the state.
 * @returns {[T, (value: T) => void, RefObject<T>]} - The stateful value, a function to set the value, and a ref to the value.
 *
 * @example
 * ```tsx
 * import { useStateRef } from '@faasjs/react'
 *
 * function MyComponent() {
 *  const [value, setValue, ref] = useStateRef(0)
 *
 * return (
 *   <div>
 *     <p>Value: {value}</p>
 *     <button onClick={() => setValue(value + 1)}>Increment</button>
 *     <button onClick={() => console.log(ref.current)}>Submit</button>
 *   </div>
 * )
 */
export function useStateRef<T>(
  initialValue: T
): [T, (value: T) => void, RefObject<T>] {
  const [state, setState] = useState(initialValue)
  const ref = useRef(state)

  useEffect(() => {
    ref.current = state
  }, [state])

  return [state, setState, ref]
}
