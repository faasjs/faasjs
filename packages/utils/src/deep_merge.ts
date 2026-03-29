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
 * @param {any[]} sources - Objects or arrays to merge from left to right.
 * @returns {any} A cloned merged value built from the provided sources.
 *
 * @example
 * ```ts
 * import { deepMerge } from '@faasjs/utils'
 *
 * deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
 * deepMerge({ a: [0] }, { a: [1] }) // { a: [1, 0] }
 * ```
 */
export function deepMerge(...sources: any[]): any {
  let acc = Object.create(null)

  for (const source of sources) {
    if (Array.isArray(source)) {
      if (!Array.isArray(acc)) acc = []
      acc = [...new Set(source.concat(...(acc as any[])))]
      continue
    }

    if (!shouldMerge(source)) continue

    for (const [key, value] of Object.entries(source))
      acc = {
        ...acc,
        [key]: shouldMerge(value) ? deepMerge(acc[key], value) : value,
      }
  }

  return acc
}
