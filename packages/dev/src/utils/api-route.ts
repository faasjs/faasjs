import { relative } from 'node:path'

export type ApiFileRoute = {
  route: string
  requestPath: string
  priority: number
}

export function normalizeApiRoute(path: string): string {
  const normalized = path.replace(/\\/g, '/').replace(/\/+/g, '/')

  if (!normalized.length || normalized === '/') return '/'

  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized
}

export function resolveApiRouteFromRelativeFile(relativeFile: string): ApiFileRoute | undefined {
  const normalized = relativeFile.replace(/\\/g, '/')

  if (!normalized.endsWith('.api.ts')) return undefined

  const noTsPath = normalized.slice(0, -'.ts'.length)

  if (noTsPath === 'index.api')
    return {
      route: '/',
      requestPath: '/',
      priority: 2,
    }

  if (noTsPath === 'default.api')
    return {
      route: '/*',
      requestPath: '/',
      priority: 1,
    }

  if (noTsPath.endsWith('/index.api')) {
    const requestPath = normalizeApiRoute(`/${noTsPath.slice(0, -'/index.api'.length)}`)

    return {
      route: requestPath,
      requestPath,
      priority: 2,
    }
  }

  if (noTsPath.endsWith('/default.api')) {
    const requestPath = normalizeApiRoute(`/${noTsPath.slice(0, -'/default.api'.length)}`)

    return {
      route: normalizeApiRoute(`${requestPath}/*`),
      requestPath,
      priority: 1,
    }
  }

  if (noTsPath.endsWith('.api')) {
    const requestPath = normalizeApiRoute(`/${noTsPath.slice(0, -'.api'.length)}`)

    return {
      route: requestPath,
      requestPath,
      priority: 3,
    }
  }

  return undefined
}

export function resolveApiRouteFromFile(srcRoot: string, file: string): ApiFileRoute | undefined {
  return resolveApiRouteFromRelativeFile(relative(srcRoot, file))
}

export function inferApiRequestPathFromFilename(filename: string): string | undefined {
  if (!filename) return undefined

  const normalized = filename.replace(/\\/g, '/')
  const srcIndex = normalized.lastIndexOf('/src/')

  if (srcIndex === -1) return undefined

  const relativeFile = normalized.slice(srcIndex + '/src/'.length)

  if (/(^|\/)__tests__(\/|$)/.test(relativeFile)) return undefined

  return resolveApiRouteFromRelativeFile(relativeFile)?.requestPath
}
