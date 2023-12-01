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
        let val
        if (shouldMerge(value)) val = deepMerge(acc[key], value)
        else val = value
        acc = {
          ...acc,
          [key]: val,
        }
      }

  return acc
}
