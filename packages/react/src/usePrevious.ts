import { useEffect, useRef } from 'react'

/**
 * Hook to store the previous value of a state or prop.
 *
 * @template T - The type of the value.
 * @param {T} value - The current value to be stored.
 * @returns {T | undefined} - The previous value, or undefined if there is no previous value.
 */
export function usePrevious<T = any>(value: T): T | undefined {
  const ref = useRef<T>(undefined)

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
