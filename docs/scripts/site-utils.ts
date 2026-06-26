import { readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, posix } from 'node:path'

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

export function joinSitePath(base: string, value: string): string {
  const cleanBase = base.endsWith('/') ? base : `${base}/`
  const joined = posix.join(cleanBase, value)
  if (value.endsWith('/')) {
    return joined.endsWith('/') ? joined : `${joined}/`
  }
  return joined
}
