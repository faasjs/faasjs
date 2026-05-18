import { existsSync, realpathSync } from 'node:fs'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'

function normalizeFileSystemPath(path: string): string {
  const resolvedPath = resolve(path)
  let currentPath = resolvedPath

  while (!existsSync(currentPath)) {
    const parentPath = dirname(currentPath)

    if (parentPath === currentPath) return resolvedPath

    currentPath = parentPath
  }

  try {
    const normalizedCurrentPath = realpathSync.native(currentPath)

    if (currentPath === resolvedPath) return normalizedCurrentPath

    return resolve(normalizedCurrentPath, relative(currentPath, resolvedPath))
  } catch {
    return resolvedPath
  }
}

/**
 * Check whether a filesystem path stays within a root directory after normalization.
 *
 * Existing paths are resolved through `realpath` so symlink escapes are rejected, while
 * missing paths still fall back to their resolved absolute location for containment checks.
 *
 * @param {string} path - Target path to validate.
 * @param {string} root - Root directory that must contain the target path.
 * @returns {boolean} `true` when the target stays inside `root`, otherwise `false`.
 *
 * @example
 * ```ts
 * import { isPathInsideRoot } from '@faasjs/node-utils'
 *
 * isPathInsideRoot('/project/public/index.html', '/project/public')
 * ```
 */
export function isPathInsideRoot(path: string, root: string): boolean {
  const normalizedRoot = normalizeFileSystemPath(root)
  const normalizedPath = normalizeFileSystemPath(path)
  const relativePath = relative(normalizedRoot, normalizedPath)

  return !(relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath))
}
