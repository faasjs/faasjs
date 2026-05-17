import { useRef } from 'react'

/**
 * Returns a constant value that is created by the given function.
 *
 * @template T - Constant value type returned by the initializer.
 * @param {() => T} fn - Initializer that runs only once for the current component instance.
 * @returns {T} Stable value returned by the initializer.
 *
 * @example
 * ```tsx
 * import { useConstant } from '@faasjs/react'
 *
 * function Page() {
 *   const requestId = useConstant(() => crypto.randomUUID())
 *
 *   return <span>{requestId}</span>
 * }
 * ```
 */
export function useConstant<T>(fn: () => T): T {
  const ref = useRef<{ v: T }>(null)

  if (!ref.current) {
    ref.current = { v: fn() }
  }

  return ref.current.v
}
