import { useCallback, useEffect, useMemo, useRef } from 'react'

const AsyncFunction = (async () => {}).constructor

/**
 * Compares two values for deep equality.
 *
 * This function checks if two values are deeply equal by comparing their types and contents.
 * It handles various data types including primitives, arrays, dates, regular expressions, functions,
 * maps, sets, and promises.
 *
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns `true` if the values are deeply equal, `false` otherwise.
 *
 * @example
 * ```ts
 * import { equal } from '@faasjs/react'
 *
 * equal({ page: 1, filters: ['a'] }, { page: 1, filters: ['a'] }) // true
 * equal({ page: 1 }, { page: 2 }) // false
 * ```
 */
export function equal(a: any, b: any): boolean {
  if (a === b) return true

  if ((a === null || a === undefined) && (b === null || b === undefined)) return true

  if (typeof a !== typeof b) return false

  if (a === null || a === undefined || b === null || b === undefined) return false

  const ctor = a.constructor

  if (ctor !== b.constructor) return false

  switch (ctor) {
    case String:
    case Boolean:
      return a === b

    case Number:
      return (Number.isNaN(a) && Number.isNaN(b)) || a === b

    case Array: {
      if (a.length !== b.length) return false

      for (let i = 0; i < a.length; i++) {
        if (!equal(a[i], b[i])) return false
      }

      return true
    }
    case Date:
      return a.getTime() === b.getTime()

    case RegExp:
    case Function:
    case AsyncFunction:
      return a.toString() === b.toString()

    case Map:
    case Set:
      return equal(Array.from(a), Array.from(b))

    case Promise:
      return a === b

    case Object: {
      for (const key of new Set([...Object.keys(a), ...Object.keys(b)]))
        if (!equal(a[key], b[key])) return false

      return true
    }

    default:
      throw Error(`Unsupported type: ${ctor}`)
  }
}

/**
 * Custom hook that memoizes a value using deep equality comparison.
 *
 * @param value - The value to be memoized.
 * @returns The memoized value.
 *
 * @example
 * ```tsx
 * import { useEqualMemoize } from '@faasjs/react'
 *
 * function Filters({ filters }: { filters: Record<string, any> }) {
 *   const memoizedFilters = useEqualMemoize(filters)
 *
 *   return <pre>{JSON.stringify(memoizedFilters)}</pre>
 * }
 * ```
 */
export function useEqualMemoize(value: any) {
  const ref = useRef<any>(value)

  if (!equal(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

function useEqualSignal(value: any[]) {
  const ref = useRef<any[]>(value)
  const signalRef = useRef(0)

  if (!equal(value, ref.current)) {
    ref.current = value
    signalRef.current += 1
  }

  return signalRef.current
}

/**
 * Custom hook that works like `useEffect` but uses deep comparison on dependencies.
 *
 * @param callback - The effect callback function to run.
 * @param dependencies - The list of dependencies for the effect.
 * @returns The result of the `useEffect` hook with memoized dependencies.
 *
 * @example
 * ```tsx
 * import { useEqualEffect } from '@faasjs/react'
 *
 * function Page({ filters }: { filters: Record<string, any> }) {
 *   useEqualEffect(() => {
 *     console.log('filters changed', filters)
 *   }, [filters])
 *
 *   return null
 * }
 * ```
 */
export function useEqualEffect(callback: React.EffectCallback, dependencies: any[]) {
  const signal = useEqualSignal(dependencies)

  // eslint-disable-next-line react-hooks/exhaustive-deps -- deep-compare hook owns dependency tracking
  return useEffect(callback, [signal])
}

/**
 * Custom hook that works like `useMemo` but uses deep comparison on dependencies.
 *
 * @template T - Memoized value type returned by the callback.
 *
 * @param callback - The callback function to run.
 * @param dependencies - The list of dependencies.
 * @returns The result of the `useMemo` hook with memoized dependencies.
 *
 * @example
 * ```tsx
 * import { useEqualMemo } from '@faasjs/react'
 *
 * function Page({ filters }: { filters: Record<string, any> }) {
 *   const queryString = useEqualMemo(() => JSON.stringify(filters), [filters])
 *
 *   return <span>{queryString}</span>
 * }
 * ```
 */
export function useEqualMemo<T>(callback: () => T, dependencies: any[]): T {
  const signal = useEqualSignal(dependencies)
  const callbackRef = useRef(callback)

  callbackRef.current = callback

  return useMemo(() => {
    void signal
    return callbackRef.current()
  }, [signal])
}

/**
 * Custom hook that works like `useCallback` but uses deep comparison on dependencies.
 *
 * @template T - Callback signature to memoize.
 *
 * @param callback - The callback function to run.
 * @param dependencies - The list of dependencies.
 * @returns The result of the `useCallback` hook with memoized dependencies.
 *
 * @example
 * ```tsx
 * import { useEqualCallback } from '@faasjs/react'
 *
 * function Search({ filters }: { filters: Record<string, any> }) {
 *   const handleSubmit = useEqualCallback(() => {
 *     console.log(filters)
 *   }, [filters])
 *
 *   return <button onClick={handleSubmit}>Search</button>
 * }
 * ```
 */
export function useEqualCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[],
): T {
  const signal = useEqualSignal(dependencies)

  // eslint-disable-next-line react-hooks/exhaustive-deps -- deep-compare hook owns dependency tracking
  return useCallback<any>((...args: any) => callback(...args), [signal])
}
