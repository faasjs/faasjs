import { readdirSync, statSync } from 'node:fs'
import { basename, dirname, extname, join, posix } from 'node:path'

const IGNORED_DIRECTORIES = new Set(['.vuepress', 'dist', 'node_modules'])

export function toPosixPath(path: string): string {
  return path.replace(/\\/g, '/')
}

export function walkMarkdownFiles(root: string): string[] {
  const files: string[] = []
  const stack = [root]

  while (stack.length) {
    const current = stack.pop()
    if (!current) continue

    for (const entry of readdirSync(current)) {
      const fullPath = join(current, entry)
      const stats = statSync(fullPath)

      if (stats.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry)) continue
        stack.push(fullPath)
        continue
      }

      if (entry.toLowerCase().endsWith('.md')) {
        files.push(fullPath)
      }
    }
  }

  return files.sort((a, b) => a.localeCompare(b))
}

export function toRouteFromMarkdownPath(relativePath: string): {
  routePath: string
  outputPath: string
} {
  const normalized = toPosixPath(relativePath)
  const filename = basename(normalized).toLowerCase()

  if (filename === 'readme.md') {
    const folder = dirname(normalized)
    const routePath = folder === '.' ? '/' : `/${folder}/`
    const outputPath = folder === '.' ? 'index.html' : `${folder}/index.html`
    return { routePath, outputPath }
  }

  const outputPath = normalized.replace(/\.md$/i, '.html')
  return {
    routePath: `/${outputPath}`,
    outputPath,
  }
}

export function splitHref(href: string): {
  path: string
  query: string
  hash: string
} {
  const match = href.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/)
  return {
    path: match?.[1] ?? href,
    query: match?.[2] ?? '',
    hash: match?.[3] ?? '',
  }
}

export function isExternalLink(href: string): boolean {
  return /^(?:[a-zA-Z][a-zA-Z\d+.-]*:|\/\/)/.test(href)
}

export function normalizeRouteForCompare(route: string): string {
  if (!route) return '/'

  let normalized = route.trim()

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }

  normalized = normalized.replace(/\/+/g, '/')

  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }

  return normalized || '/'
}

export function extractRoutesFromSitemapXml(
  xml: string,
  hostname: string
): string[] {
  const routes = new Set<string>()
  const regex = /<loc>([^<]+)<\/loc>/g

  let current = regex.exec(xml)

  while (current) {
    const loc = current[1]?.trim() ?? ''
    if (loc) {
      let route = ''
      if (loc.startsWith(hostname)) {
        route = loc.slice(hostname.length) || '/'
      } else if (loc.startsWith('/')) {
        route = loc
      } else {
        try {
          const parsed = new URL(loc)
          if (`${parsed.protocol}//${parsed.host}` === hostname) {
            route = parsed.pathname || '/'
          }
        } catch {
          route = ''
        }
      }

      if (route) {
        routes.add(route)
      }
    }

    current = regex.exec(xml)
  }

  return Array.from(routes).sort((a, b) => {
    if (a === '/') return -1
    if (b === '/') return 1
    return a.localeCompare(b)
  })
}

export function toAliasKey(route: string): string {
  return normalizeRouteForCompare(route)
}

export function joinSitePath(base: string, value: string): string {
  const cleanBase = base.endsWith('/') ? base : `${base}/`
  const joined = posix.join(cleanBase, value)
  if (value.endsWith('/')) {
    return joined.endsWith('/') ? joined : `${joined}/`
  }
  return joined
}

export function hasExtension(path: string): boolean {
  return Boolean(extname(path))
}
