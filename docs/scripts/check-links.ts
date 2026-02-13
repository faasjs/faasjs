import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, posix, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  hasExtension,
  isExternalLink,
  normalizeRouteForCompare,
  splitHref,
  toPosixPath,
} from './site-utils.ts'

type LinkIssue = {
  file: string
  rawLink: string
  resolvedPath: string
  reason: string
}

function walkFiles(root: string): string[] {
  const files: string[] = []
  const stack = [root]

  while (stack.length) {
    const current = stack.pop()
    if (!current) continue

    for (const entry of readdirSync(current)) {
      const fullPath = join(current, entry)
      const stats = statSync(fullPath)

      if (stats.isDirectory()) {
        stack.push(fullPath)
        continue
      }

      files.push(fullPath)
    }
  }

  return files.sort((a, b) => a.localeCompare(b))
}

function routeFromHtmlPath(relativePath: string): string {
  const normalized = toPosixPath(relativePath)

  if (normalized === 'index.html') {
    return '/'
  }

  if (normalized.endsWith('/index.html')) {
    return `/${normalized.slice(0, -'index.html'.length)}`
  }

  return `/${normalized}`
}

function resolveRelativePath(baseRoute: string, linkPath: string): string {
  const baseDirectory = baseRoute.endsWith('/')
    ? baseRoute
    : `${baseRoute.slice(0, baseRoute.lastIndexOf('/') + 1)}`

  const normalized = posix.normalize(
    posix.join(baseDirectory, decodeURIComponent(linkPath))
  )
  if (linkPath.endsWith('/') && !normalized.endsWith('/')) {
    return `${normalized}/`
  }

  return normalized.startsWith('/') ? normalized : `/${normalized}`
}

function linkPathExists(
  pathname: string,
  routeSet: Set<string>,
  fileSet: Set<string>
): boolean {
  if (pathname === '/') {
    return routeSet.has('/') || fileSet.has('index.html')
  }

  const normalizedRoute = normalizeRouteForCompare(pathname)
  if (routeSet.has(normalizedRoute)) {
    return true
  }

  const filePath = pathname.replace(/^\//, '')
  if (fileSet.has(filePath)) {
    return true
  }

  if (pathname.endsWith('/')) {
    return fileSet.has(`${filePath}index.html`)
  }

  if (!hasExtension(pathname)) {
    return (
      fileSet.has(`${filePath}.html`) || fileSet.has(`${filePath}/index.html`)
    )
  }

  return false
}

const scriptPath = fileURLToPath(import.meta.url)
const scriptsDirectory = dirname(scriptPath)
const docsRoot = resolve(scriptsDirectory, '..')
const distRoot = join(docsRoot, 'dist')

if (!existsSync(distRoot)) {
  throw new Error(
    `Missing dist directory at ${distRoot}. Run npm run build first.`
  )
}

const allDistFiles = walkFiles(distRoot)
const htmlFiles = allDistFiles.filter(filePath =>
  filePath.toLowerCase().endsWith('.html')
)

const fileSet = new Set(
  allDistFiles.map(filePath => toPosixPath(relative(distRoot, filePath)))
)
const routeSet = new Set(
  htmlFiles.map(filePath => {
    return normalizeRouteForCompare(
      routeFromHtmlPath(toPosixPath(relative(distRoot, filePath)))
    )
  })
)

const issues: LinkIssue[] = []
const LINK_RE = /(?:href|src)=["']([^"']+)["']/g

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8')
  const htmlRelativePath = toPosixPath(relative(distRoot, htmlFile))
  const pageRoute = routeFromHtmlPath(htmlRelativePath)

  let current = LINK_RE.exec(html)

  while (current) {
    const rawLink = current[1] ?? ''

    if (
      !rawLink ||
      rawLink.startsWith('#') ||
      rawLink.startsWith('data:') ||
      rawLink.startsWith('mailto:') ||
      rawLink.startsWith('tel:') ||
      rawLink.startsWith('javascript:') ||
      isExternalLink(rawLink)
    ) {
      current = LINK_RE.exec(html)
      continue
    }

    const href = splitHref(rawLink)
    if (!href.path) {
      current = LINK_RE.exec(html)
      continue
    }

    const resolvedPath = href.path.startsWith('/')
      ? href.path
      : resolveRelativePath(pageRoute, href.path)

    const lowerResolvedPath = resolvedPath.toLowerCase()
    if (lowerResolvedPath.endsWith('.md')) {
      issues.push({
        file: htmlRelativePath,
        rawLink,
        resolvedPath,
        reason: 'internal markdown link not rewritten',
      })
      current = LINK_RE.exec(html)
      continue
    }

    if (!linkPathExists(resolvedPath, routeSet, fileSet)) {
      issues.push({
        file: htmlRelativePath,
        rawLink,
        resolvedPath,
        reason: 'target path does not exist in dist',
      })
    }

    current = LINK_RE.exec(html)
  }
}

if (!issues.length) {
  console.log(`Link check passed across ${htmlFiles.length} html files.`)
  process.exit(0)
}

console.error(`Link check failed with ${issues.length} issue(s).`)
for (const issue of issues.slice(0, 200)) {
  console.error(
    `- ${issue.file}: ${issue.rawLink} -> ${issue.resolvedPath} (${issue.reason})`
  )
}

process.exit(1)
