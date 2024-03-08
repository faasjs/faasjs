import { useRef } from 'react'

/**
 * Returns a constant value that is created by the given function.
 */
export function useConstant<T>(fn: () => T): T {
  const ref = useRef<{ v: T }>()

  if (!ref.current) {
    ref.current = { v: fn() }
  }

  return ref.current.v
}

useConstant.whyDidYouRender = true
