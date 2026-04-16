import { useEffect, useRef } from 'react'

/**
 * Hook to store the previous value of a state or prop.
 *
 * @template T - The type of the value.
 * @param {T} value - The current value to track.
 * @returns {T | undefined} Previous value from the prior render, or `undefined` on the first render.
 *
 * @example
 * ```tsx
 * import { usePrevious } from '@faasjs/react'
 *
 * function Counter({ count }: { count: number }) {
 *   const previous = usePrevious(count)
 *
 *   return <span>{previous} -> {count}</span>
 * }
 * ```
 */
export function usePrevious<T = any>(value: T): T | undefined {
  const ref = useRef<T>(undefined)

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
