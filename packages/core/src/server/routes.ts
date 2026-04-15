import { sep } from 'node:path'

/**
 * Enumerate candidate route files for a requested path in FaasJS lookup order.
 *
 * This includes the exact `.func.ts` file, nested `index.func.ts`, nested
 * `default.func.ts`, and parent `default.func.ts` fallbacks while walking back to `root`.
 *
 * @param {string} root - Server root path used to stop parent fallback discovery.
 * @param {string} path - Normalized request path resolved against the server root.
 * @returns {string[]} Candidate route files in the order the server checks them.
 * @example
 * ```ts
 * const files = getRouteFiles('/app/src', '/app/src/pages/users/profile')
 * ```
 */
export function getRouteFiles(root: string, path: string): string[] {
  const normalizedRoot = root.endsWith(sep) ? root : `${root}${sep}`

  const normalizedPath = path.endsWith(sep) ? path.slice(0, -1) : path

  const searchPaths = [
    `${normalizedPath}.func.ts`,
    `${normalizedPath}${sep}index.func.ts`,
    `${normalizedPath}${sep}default.func.ts`,
  ]

  let currentPath = normalizedPath
  while (currentPath.length > normalizedRoot.length) {
    const lastSepIndex = currentPath.lastIndexOf(sep)
    if (lastSepIndex === -1) break

    currentPath = currentPath.substring(0, lastSepIndex)

    if (currentPath.length < normalizedRoot.length - 1) break

    searchPaths.push(`${currentPath}${sep}default.func.ts`)
  }

  return searchPaths
}
