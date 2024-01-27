/**
 * A helper function to deep merge objects and array.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/deep_merge.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/deep_merge/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/deep_merge.svg)](https://www.npmjs.com/package/@faasjs/deep_merge)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/deep_merge
 * ```
 * @packageDocumentation
 */

const shouldMerge = (item: any) => {
  const type = Object.prototype.toString.call(item)
  return type === '[object Object]' || type === '[object Array]'
}

/**
 * Deep merge two objects or arrays.
 *
 * Features:
 * * All objects will be cloned before merging.
 * * Merging order is from right to left.
 * * If an array include same objects, it will be unique to one.
 *
 * ```ts
 * deepMerge({ a: 1 }, { a: 2 }) // { a: 2 }
 * deepMerge([1, 2], [2, 3]) // [1, 2, 3]
 * ```
 */
export function deepMerge(...sources: any[]): any {
  let acc = Object.create(null)
  for (const source of sources)
    if (Array.isArray(source)) {
      if (!Array.isArray(acc)) acc = []
      acc = [...new Set(source.concat(...(acc as any[])))]
    } else if (shouldMerge(source))
      for (const [key, value] of Object.entries(source)) {
        let val: any
        if (shouldMerge(value)) val = deepMerge(acc[key], value)
        else val = value
        acc = {
          ...acc,
          [key]: val,
        }
      }

  return acc
}
