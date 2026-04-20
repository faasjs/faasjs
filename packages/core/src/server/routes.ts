import { sep } from 'node:path'

/**
 * Enumerate candidate route files for a requested path in FaasJS lookup order.
 *
 * This includes the exact `.api.ts` file, nested `index.api.ts`, nested
 * `default.api.ts`, and parent `default.api.ts` fallbacks while walking back to `root`.
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
    `${normalizedPath}.api.ts`,
    `${normalizedPath}${sep}index.api.ts`,
    `${normalizedPath}${sep}default.api.ts`,
  ]

  let currentPath = normalizedPath
  while (currentPath.length > normalizedRoot.length) {
    const lastSepIndex = currentPath.lastIndexOf(sep)
    if (lastSepIndex === -1) break

    currentPath = currentPath.substring(0, lastSepIndex)

    if (currentPath.length < normalizedRoot.length - 1) break

    searchPaths.push(`${currentPath}${sep}default.api.ts`)
  }

  return searchPaths
}
