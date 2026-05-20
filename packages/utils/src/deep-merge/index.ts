/** @internal */
const shouldMerge = (item: any) => {
  const type = Object.prototype.toString.call(item)
  return type === '[object Object]' || type === '[object Array]'
}

/**
 * Deeply clone and merge plain objects or arrays.
 *
 * Later sources override earlier object properties, and nested objects are merged recursively.
 * Array values are deduplicated with `Set`, with items from newer sources appearing first.
 * Non-object and non-array inputs are ignored.
 *
 * @param sources - Objects or arrays to merge from left to right.
 * @returns A cloned merged value built from the provided sources.
 *
 * @example
 * ```ts
 * import { deepMerge } from '@faasjs/utils'
 *
 * deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
 * deepMerge({ a: [0] }, { a: [1] }) // { a: [1, 0] }
 * ```
 */
export function deepMerge<A extends object>(a: A): A
export function deepMerge<A extends object, B extends object>(a: A, b: B): A & B
export function deepMerge<A extends object, B extends object, C extends object>(
  a: A,
  b: B,
  c: C,
): A & B & C
export function deepMerge<A extends object, B extends object, C extends object, D extends object>(
  a: A,
  b: B,
  c: C,
  d: D,
): A & B & C & D
export function deepMerge(...sources: any[]): any {
  let acc: any = {}

  for (const source of sources) {
    if (Array.isArray(source)) {
      if (!Array.isArray(acc)) acc = []
      acc = [...new Set(source.concat(...(acc as any[])))]
      continue
    }

    if (!shouldMerge(source)) continue

    for (const [key, value] of Object.entries(source) as [string, any][])
      acc = {
        ...acc,
        [key]: shouldMerge(value) ? deepMerge(acc[key], value) : value,
      }
  }

  return acc
}
