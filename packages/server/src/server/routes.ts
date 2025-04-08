import { sep } from 'node:path'

export function getRouteFiles(root: string, path: string): string[] {
  const normalizedRoot = root.endsWith(sep) ? root : `${root}${sep}`

  const normalizedPath = path.endsWith(sep) ? path.slice(0, -1) : path

  const searchPaths = [
    `${normalizedPath}.func.ts`,
    `${normalizedPath}.func.tsx`,
    `${normalizedPath}${sep}index.func.ts`,
    `${normalizedPath}${sep}index.func.tsx`,
    `${normalizedPath}${sep}default.func.ts`,
    `${normalizedPath}${sep}default.func.tsx`,
  ]

  let currentPath = normalizedPath
  while (currentPath.length > normalizedRoot.length) {
    const lastSepIndex = currentPath.lastIndexOf(sep)
    if (lastSepIndex === -1) break

    currentPath = currentPath.substring(0, lastSepIndex)

    if (currentPath.length < normalizedRoot.length - 1) break

    searchPaths.push(
      `${currentPath}${sep}default.func.ts`,
      `${currentPath}${sep}default.func.tsx`
    )
  }

  return searchPaths
}
