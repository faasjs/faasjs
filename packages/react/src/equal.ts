import { useEffect, useRef } from 'react'

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
 */
export function equal(a: any, b: any): boolean {
  if (a === b) return true

  if (typeof a !== typeof b) return false

  if (a === null || a === undefined) return true

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
      return a.toString() === b.toString()

    case Map:
    case Set:
      return equal(Array.from(a), Array.from(b))

    case Promise:
      return a === b

    case Object: {
      const keys = Object.keys(a)

      if (keys.length !== Object.keys(b).length) return false

      for (const key of keys) {
        if (!equal(a[key], b[key])) return false
      }

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
 */
export function useEqualMemoize(value: any) {
  const ref = useRef<any>()

  if (!equal(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

/**
 * Custom hook that works like `useEffect` but uses deep comparison on dependencies.
 *
 * @param callback - The effect callback function to run.
 * @param dependencies - The list of dependencies for the effect.
 * @returns The result of the `useEffect` hook with memoized dependencies.
 */
export function useEqualEffect(
  callback: React.EffectCallback,
  dependencies: any[]
) {
  return useEffect(callback, useEqualMemoize(dependencies))
}
