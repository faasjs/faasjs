import { deepMerge as utilsDeepMerge } from '@faasjs/utils'

/**
 * Internal deep merge used by `loadConfig`.
 *
 * Later sources override earlier object properties, and nested objects are merged recursively.
 * Array values are deduplicated with `Set`, with items from newer sources appearing first.
 * Non-object and non-array inputs are ignored.
 *
 * @param {any[]} sources - Objects or arrays to merge from left to right.
 * @returns {any} A cloned merged value built from the provided sources.
 *
 */
export function deepMerge(...sources: any[]): any {
  return utilsDeepMerge(...sources)
}
