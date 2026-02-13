import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import {
  type LocaleConfig,
  type NavbarItem,
  type SidebarItem,
  siteConfig,
} from '../site/site.config.ts'
import { renderLayout } from '../templates/layout.ts'
import {
  classNames,
  escapeHtml,
  isExternalLink as isTemplateExternal,
  renderAutoLink,
} from '../templates/partials.ts'
import { buildSitemapXml, type SitemapRoute } from './build-sitemap.ts'
import {
  hasExtension,
  isExternalLink,
  joinSitePath,
  splitHref,
  toAliasKey,
  toPosixPath,
  toRouteFromMarkdownPath,
  walkMarkdownFiles,
} from './site-utils.ts'

type LocaleKey = '/' | '/zh/'

type Page = {
  sourcePath: string
  relativePath: string
  routePath: string
  outputPath: string
  markdown: string
  title: string
  frontmatter: Record<string, unknown>
  locale: LocaleKey
  lastmod: string
  isHome: boolean
}

const scriptPath = fileURLToPath(import.meta.url)
const scriptsDirectory = dirname(scriptPath)
const docsRoot = resolve(scriptsDirectory, '..')
const distRoot = join(docsRoot, 'dist')
const siteRoot = join(docsRoot, 'site')

const LEGACY_ROUTE_REDIRECTS: Record<string, string> = {
  '/doc/react/functions/splittingState.md':
    '/doc/react/functions/useSplittingState.html',
  '/doc/react/functions/FaasDataWrapper.md':
    '/doc/react/variables/FaasDataWrapper.html',
  '/doc/dev/functions/runPgliteSql.html':
    '/doc/dev/functions/createPgliteKnex.html',
  '/doc/dev/functions/runPgliteSqlFile.html':
    '/doc/dev/functions/createPgliteKnex.html',
  '/doc/http/functions/useHttpFunc.html': '/doc/http/functions/useHttp.html',
}

const legacyRedirectMap = new Map(
  Object.entries(LEGACY_ROUTE_REDIRECTS).map(([from, to]) => [
    toAliasKey(from),
    to,
  ])
)

function findLocale(routePath: string): LocaleKey {
  return routePath.startsWith('/zh/') ? '/zh/' : '/'
}

function extractTitle(
  markdown: string,
  frontmatter: Record<string, unknown>,
  fallback: string
): string {
  if (typeof frontmatter.title === 'string' && frontmatter.title.trim()) {
    return frontmatter.title.trim()
  }

  const heading = markdown.match(/^#\s+(.+)$/m)
  if (heading?.[1]?.trim()) {
    return heading[1].trim()
  }

  if (typeof frontmatter.heroText === 'string' && frontmatter.heroText.trim()) {
    return frontmatter.heroText.trim()
  }

  return fallback
}

function registerAliases(page: Page, aliasMap: Map<string, string>): void {
  const markdownPath = `/${page.relativePath}`

  const addAlias = (alias: string) => {
    if (!alias) return
    aliasMap.set(toAliasKey(alias), page.routePath)
  }

  addAlias(page.routePath)
  if (page.routePath !== '/' && page.routePath.endsWith('/')) {
    addAlias(page.routePath.slice(0, -1))
  }

  addAlias(markdownPath)

  if (
    markdownPath.toLowerCase().endsWith('/readme.md') ||
    markdownPath === '/README.md'
  ) {
    const dirPath = markdownPath.replace(/README\.md$/i, '') || '/'
    addAlias(dirPath)
    if (dirPath !== '/' && dirPath.endsWith('/')) {
      addAlias(dirPath.slice(0, -1))
    }
    addAlias(`${dirPath}README`)
    addAlias(`${dirPath}README.md`)
  } else {
    const pathWithoutMd = markdownPath.replace(/\.md$/i, '')
    addAlias(pathWithoutMd)
    addAlias(`${pathWithoutMd}.html`)
  }
}

function resolveAliasLink(
  path: string,
  aliasMap: Map<string, string>
): string | undefined {
  const direct = aliasMap.get(toAliasKey(path))
  if (direct) return direct

  if (!hasExtension(path) && !path.endsWith('/')) {
    const html = aliasMap.get(toAliasKey(`${path}.html`))
    if (html) return html
  }

  const legacyRedirect = legacyRedirectMap.get(toAliasKey(path))
  if (legacyRedirect) return legacyRedirect

  return undefined
}

function toOutputPathFromRoute(route: string): string {
  if (route === '/') {
    return 'index.html'
  }

  const normalized = route.startsWith('/') ? route.slice(1) : route
  if (normalized.endsWith('/')) {
    return `${normalized}index.html`
  }

  if (!hasExtension(normalized)) {
    return `${normalized}.html`
  }

  return normalized
}

function renderRedirectHtml(to: string): string {
  const escaped = escapeHtml(to)
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${escaped}" />
    <link rel="canonical" href="${escaped}" />
    <title>Redirecting...</title>
  </head>
  <body>
    <p>Redirecting to <a href="${escaped}">${escaped}</a>.</p>
  </body>
</html>`
}

function isPrefixActive(currentRoute: string, link: string): boolean {
  if (isTemplateExternal(link)) return false
  if (link === '/') return currentRoute === '/'
  if (link.endsWith('/')) {
    return currentRoute === link || currentRoute.startsWith(link)
  }
  return currentRoute === link
}

function isExactActive(currentRoute: string, link: string): boolean {
  if (isTemplateExternal(link)) return false
  return currentRoute === link
}

function fallbackLabel(link: string): string {
  if (link === '/') return 'Home'
  const clean = link.replace(/\/$/, '')
  const piece = clean.split('/').pop() || clean
  if (!piece) return 'Overview'
  return decodeURIComponent(piece).replace(/[-_]/g, ' ')
}

function renderDropdownItem(
  item: NavbarItem,
  currentRoute: string,
  resolveConfigLink: (link: string) => string
): string {
  if (item.children?.length) {
    return `<li class="vp-navbar-dropdown-item"><h4 class="vp-navbar-dropdown-subtitle"><span>${escapeHtml(item.text)}</span></h4><ul class="vp-navbar-dropdown-subitem-wrapper">${item.children
      .map(child => {
        const href = child.link ? resolveConfigLink(child.link) : '#'
        return `<li class="vp-navbar-dropdown-subitem">${renderAutoLink({
          text: child.text,
          href,
          active: isPrefixActive(currentRoute, href),
        })}</li>`
      })
      .join('')}</ul></li>`
  }

  if (!item.link) return ''
  const href = resolveConfigLink(item.link)
  return `<li class="vp-navbar-dropdown-item">${renderAutoLink({
    text: item.text,
    href,
    active: isPrefixActive(currentRoute, href),
  })}</li>`
}

function renderNavbarItem(
  item: NavbarItem,
  currentRoute: string,
  resolveConfigLink: (link: string) => string,
  mobileDropdown: boolean
): string {
  if (item.children?.length) {
    const dropdownItems = item.children
      .map(child => renderDropdownItem(child, currentRoute, resolveConfigLink))
      .join('')

    return `<div class="vp-navbar-item"><div class="${classNames('vp-navbar-dropdown-wrapper', mobileDropdown && 'mobile')}"><button class="vp-navbar-dropdown-title" type="button" aria-label="${escapeHtml(item.text)}"><span class="title">${escapeHtml(item.text)}</span><span class="arrow down"></span></button><button class="vp-navbar-dropdown-title-mobile" type="button" aria-label="${escapeHtml(item.text)}"><span class="title">${escapeHtml(item.text)}</span><span class="right arrow"></span></button><ul class="vp-navbar-dropdown">${dropdownItems}</ul></div></div>`
  }

  if (!item.link) return ''
  const href = resolveConfigLink(item.link)
  return `<div class="vp-navbar-item">${renderAutoLink({
    text: item.text,
    href,
    active: isPrefixActive(currentRoute, href),
  })}</div>`
}

function renderNavbar(
  items: NavbarItem[],
  currentRoute: string,
  resolveConfigLink: (link: string) => string,
  className: string,
  mobileDropdown = false
): string {
  return `<nav class="${className}" aria-label="site navigation">${items
    .map(item =>
      renderNavbarItem(item, currentRoute, resolveConfigLink, mobileDropdown)
    )
    .join('')}</nav>`
}

function renderSidebarEntry(
  entry: SidebarItem,
  prefix: string,
  currentRoute: string,
  resolveConfigLink: (link: string) => string,
  titleByRoute: Map<string, string>
): string {
  if (typeof entry === 'string' || Array.isArray(entry)) {
    const target = Array.isArray(entry) ? entry[0] : entry
    const candidate = target === '' ? prefix : target
    const link = resolveConfigLink(
      candidate.startsWith('/') ? candidate : joinSitePath(prefix, candidate)
    )
    const label = Array.isArray(entry)
      ? entry[1]
      : (titleByRoute.get(link) ?? fallbackLabel(link))

    return `<li><a class="${classNames('vp-sidebar-item', 'vp-sidebar-heading', isExactActive(currentRoute, link) && 'active')}" href="${escapeHtml(link)}" aria-label="${escapeHtml(label)}">${escapeHtml(label)}</a></li>`
  }

  const children = entry.children
    .map(child => {
      const candidate = child.startsWith('/')
        ? child
        : joinSitePath(prefix, child)
      const link = resolveConfigLink(candidate)
      const label = titleByRoute.get(link) ?? fallbackLabel(link)
      return `<li><a class="${classNames('vp-sidebar-item', isExactActive(currentRoute, link) && 'active')}" href="${escapeHtml(link)}" aria-label="${escapeHtml(label)}">${escapeHtml(label)}</a></li>`
    })
    .join('')

  return `<li><p class="vp-sidebar-heading">${escapeHtml(entry.title)}</p><ul class="vp-sidebar-items">${children}</ul></li>`
}

function findSidebarPrefix(
  currentRoute: string,
  sidebar: Record<string, SidebarItem[]>
): string | undefined {
  return Object.keys(sidebar)
    .sort((a, b) => b.length - a.length)
    .find(prefix => currentRoute.startsWith(prefix))
}

function createLanguageItems(
  currentRoute: string,
  routeMap: Map<string, Page>
): NavbarItem[] {
  const enCandidate = currentRoute.startsWith('/zh/')
    ? `/${currentRoute.slice('/zh/'.length)}`
    : currentRoute
  const enRoute = enCandidate === '//' ? '/' : enCandidate
  const zhCandidate = enRoute === '/' ? '/zh/' : `/zh${enRoute}`

  const english = routeMap.has(enRoute) ? enRoute : '/'
  const chinese = routeMap.has(zhCandidate) ? zhCandidate : '/zh/'

  return [
    {
      text: 'English',
      link: english,
    },
    {
      text: '简体中文',
      link: chinese,
    },
  ]
}

function renderHomeHero(page: Page, locale: LocaleConfig): string {
  const heroImage =
    typeof page.frontmatter.heroImage === 'string'
      ? page.frontmatter.heroImage
      : '/logo.jpg'
  const heroText =
    typeof page.frontmatter.heroText === 'string'
      ? page.frontmatter.heroText
      : locale.title
  const tagline =
    typeof page.frontmatter.tagline === 'string' ? page.frontmatter.tagline : ''
  const finalTagline = tagline || locale.description

  return `<header class="vp-hero"><img class="vp-hero-image" src="${escapeHtml(
    heroImage
  )}" alt="${escapeHtml(heroText)}" /><h1>${escapeHtml(heroText)}</h1>${
    finalTagline ? `<p class="description">${escapeHtml(finalTagline)}</p>` : ''
  }</header>`
}

function renderDefaultSitemapXsl(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>FaasJS Sitemap</title>
        <meta charset="utf-8"/>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #24292f; }
          h1 { margin: 0 0 12px; }
          table { border-collapse: collapse; width: 100%; margin-top: 12px; }
          th, td { border: 1px solid #d0d7de; text-align: left; padding: 8px 10px; font-size: 14px; }
          th { background: #f6f8fa; }
          a { color: #0969da; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .muted { color: #57606a; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>FaasJS Sitemap</h1>
        <p class="muted">Generated by FaasJS Custom SSG</p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td>
                  <xsl:value-of select="sitemap:lastmod"/>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`
}

function writeStaticAssets(): void {
  const assetsDirectory = join(distRoot, 'assets')
  mkdirSync(assetsDirectory, { recursive: true })

  const baseThemeCss = readFileSync(join(siteRoot, 'legacy-theme.css'), 'utf8')
  const overridesPath = join(siteRoot, 'theme-overrides.css')
  const overridesCss = existsSync(overridesPath)
    ? readFileSync(overridesPath, 'utf8')
    : ''
  const style = [baseThemeCss, overridesCss].filter(Boolean).join('\n\n')
  writeFileSync(join(assetsDirectory, 'style.css'), style)

  copyFileSync(join(siteRoot, 'app.js'), join(assetsDirectory, 'app.js'))

  const staticAssets: Array<{ target: string; source: string }> = [
    {
      target: join(distRoot, 'CNAME'),
      source: join(docsRoot, 'CNAME'),
    },
    {
      target: join(distRoot, 'robots.txt'),
      source: join(siteRoot, 'public', 'robots.txt'),
    },
    {
      target: join(distRoot, 'ads.txt'),
      source: join(siteRoot, 'public', 'ads.txt'),
    },
    {
      target: join(distRoot, 'logo.jpg'),
      source: join(siteRoot, 'public', 'logo.jpg'),
    },
  ]

  for (const item of staticAssets) {
    if (!existsSync(item.source)) {
      throw new Error(`Missing required static asset: ${item.source}`)
    }

    copyFileSync(item.source, item.target)
  }

  const sitemapXslSource = join(siteRoot, 'public', 'sitemap.xsl')
  const sitemapXslTarget = join(distRoot, 'sitemap.xsl')
  if (existsSync(sitemapXslSource)) {
    copyFileSync(sitemapXslSource, sitemapXslTarget)
  } else {
    writeFileSync(sitemapXslTarget, renderDefaultSitemapXsl())
  }

  writeFileSync(join(distRoot, '.nojekyll'), '')
}

function createMarkdownRenderer(
  pageBySource: Map<string, Page>,
  aliasMap: Map<string, string>
): MarkdownIt {
  const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    highlight(code, language) {
      if (language && hljs.getLanguage(language)) {
        const highlighted = hljs.highlight(code, { language }).value
        return `<pre><code class="hljs language-${escapeHtml(
          language
        )}">${highlighted}</code></pre>`
      }

      return `<pre><code class="hljs">${escapeHtml(code)}</code></pre>`
    },
  })

  markdown.use(markdownItAnchor, {
    level: [1, 2, 3, 4, 5, 6],
  })

  const defaultLinkRender =
    markdown.renderer.rules.link_open ??
    ((tokens, idx, options, _env, self) =>
      self.renderToken(tokens, idx, options))

  markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const hrefIndex = tokens[idx].attrIndex('href')
    if (hrefIndex >= 0 && tokens[idx].attrs) {
      const originalHref = tokens[idx].attrs[hrefIndex]?.[1]
      if (originalHref && typeof env?.sourcePath === 'string') {
        const rewritten = rewriteLink(
          originalHref,
          env.sourcePath,
          pageBySource,
          aliasMap
        )
        tokens[idx].attrs[hrefIndex][1] = rewritten

        if (isExternalLink(rewritten)) {
          tokens[idx].attrSet('target', '_blank')
          tokens[idx].attrSet('rel', 'noopener noreferrer')
          tokens[idx].attrJoin('class', 'external-link')
        }
      }
    }

    return defaultLinkRender(tokens, idx, options, env, self)
  }

  return markdown
}

function rewriteLink(
  rawHref: string,
  sourcePath: string,
  pageBySource: Map<string, Page>,
  aliasMap: Map<string, string>
): string {
  if (!rawHref || rawHref.startsWith('#') || isExternalLink(rawHref)) {
    return rawHref
  }

  const href = splitHref(rawHref)
  if (!href.path) return rawHref

  const resolvedPath = href.path.startsWith('/')
    ? (resolveAliasLink(href.path, aliasMap) ?? href.path)
    : resolveRelativeLink(href.path, sourcePath, pageBySource)

  const link = resolvedPath.startsWith('/')
    ? (resolveAliasLink(resolvedPath, aliasMap) ?? resolvedPath)
    : resolvedPath

  return `${link}${href.query}${href.hash}`
}

function resolveRelativeLink(
  rawPath: string,
  sourcePath: string,
  pageBySource: Map<string, Page>
): string {
  const absoluteTarget = resolve(
    dirname(sourcePath),
    decodeURIComponent(rawPath)
  )
  const normalizedTarget = toPosixPath(absoluteTarget)

  const candidates: string[] = []

  if (normalizedTarget.toLowerCase().endsWith('.md')) {
    candidates.push(normalizedTarget)
  }

  if (rawPath.endsWith('/')) {
    candidates.push(toPosixPath(join(absoluteTarget, 'README.md')))
  } else if (!normalizedTarget.toLowerCase().endsWith('.md')) {
    candidates.push(`${normalizedTarget}.md`)
    candidates.push(toPosixPath(join(absoluteTarget, 'README.md')))
  }

  for (const candidate of candidates) {
    const page = pageBySource.get(candidate)
    if (page) {
      return page.routePath
    }
  }

  const relativeTarget = toPosixPath(relative(docsRoot, absoluteTarget))
  if (!relativeTarget.startsWith('..')) {
    const fallback = `/${relativeTarget}`
    if (rawPath.endsWith('/') && !fallback.endsWith('/')) {
      return `${fallback}/`
    }
    return fallback
  }

  return rawPath
}

function buildSite(): void {
  rmSync(distRoot, { recursive: true, force: true })
  mkdirSync(distRoot, { recursive: true })

  const markdownFiles = walkMarkdownFiles(docsRoot)
  const pages: Page[] = markdownFiles.map(sourcePath => {
    const relativePath = toPosixPath(relative(docsRoot, sourcePath))
    const route = toRouteFromMarkdownPath(relativePath)
    const source = readFileSync(sourcePath, 'utf8')
    const parsed = matter(source)
    const locale = findLocale(route.routePath)
    const localeConfig = siteConfig.locales[locale]

    return {
      sourcePath: toPosixPath(sourcePath),
      relativePath,
      routePath: route.routePath,
      outputPath: route.outputPath,
      markdown: parsed.content,
      frontmatter: parsed.data,
      title: extractTitle(parsed.content, parsed.data, localeConfig.title),
      locale,
      isHome: parsed.data.home === true,
      lastmod: statSync(sourcePath).mtime.toISOString(),
    }
  })

  const pageBySource = new Map<string, Page>()
  const pageByRoute = new Map<string, Page>()
  const aliasMap = new Map<string, string>()
  const titleByRoute = new Map<string, string>()

  for (const page of pages) {
    pageBySource.set(page.sourcePath, page)
    pageByRoute.set(page.routePath, page)
    titleByRoute.set(page.routePath, page.title)
    registerAliases(page, aliasMap)
  }

  const resolveConfigLink = (link: string): string => {
    if (isExternalLink(link) || link.startsWith('#')) {
      return link
    }

    const href = splitHref(link)
    if (!href.path) return link

    const resolved = href.path.startsWith('/')
      ? (resolveAliasLink(href.path, aliasMap) ?? href.path)
      : href.path

    return `${resolved}${href.query}${href.hash}`
  }

  const markdown = createMarkdownRenderer(pageBySource, aliasMap)

  for (const page of pages) {
    const localeConfig = siteConfig.locales[page.locale]
    const languageItems = createLanguageItems(page.routePath, pageByRoute)

    const navbarItems = [
      ...localeConfig.navbar,
      {
        text: localeConfig.selectLanguageName,
        children: languageItems,
      },
    ]

    const navbarHtml = renderNavbar(
      navbarItems,
      page.routePath,
      resolveConfigLink,
      'vp-navbar-items vp-hide-mobile'
    )

    const mobileNavbarHtml = renderNavbar(
      navbarItems,
      page.routePath,
      resolveConfigLink,
      'vp-navbar-items',
      true
    )

    const sidebarPrefix = findSidebarPrefix(
      page.routePath,
      localeConfig.sidebar
    )
    const sidebarEntries = sidebarPrefix
      ? (localeConfig.sidebar[sidebarPrefix] ?? [])
      : []
    const hasSidebar = Boolean(sidebarPrefix && sidebarEntries.length)

    const sidebarLinks =
      hasSidebar && sidebarPrefix
        ? `<ul class="vp-sidebar-items">${sidebarEntries
            .map(entry =>
              renderSidebarEntry(
                entry,
                sidebarPrefix,
                page.routePath,
                resolveConfigLink,
                titleByRoute
              )
            )
            .join('')}</ul>`
        : ''

    const markdownHtml = markdown.render(page.markdown, {
      sourcePath: page.sourcePath,
    })

    const contentHtml = page.isHome
      ? `<div class="vp-home">${renderHomeHero(
          page,
          localeConfig
        )}<div class="theme-default-content">${markdownHtml}</div></div>`
      : `<div class="theme-default-content">${markdownHtml}</div>`

    const footerText =
      page.isHome &&
      (typeof page.frontmatter.footer === 'string'
        ? page.frontmatter.footer
        : localeConfig.footer)

    const pageTitle =
      page.routePath === '/' || page.routePath === '/zh/'
        ? localeConfig.title
        : `${page.title} | ${localeConfig.title}`

    const description =
      typeof page.frontmatter.description === 'string'
        ? page.frontmatter.description
        : localeConfig.description

    const homeLink = page.locale === '/zh/' ? '/zh/' : '/'

    const html = renderLayout({
      lang: localeConfig.lang,
      title: pageTitle,
      description,
      homeLink,
      hasSidebar,
      navbarHtml,
      sidebarHtml: `${mobileNavbarHtml}${sidebarLinks}`,
      contentHtml,
      footerHtml: footerText
        ? `<footer class="vp-footer">${escapeHtml(footerText)}</footer>`
        : undefined,
      gaId: siteConfig.gaId,
      adsScript: siteConfig.adsScript,
    })

    const outputFile = join(distRoot, page.outputPath)
    mkdirSync(dirname(outputFile), { recursive: true })
    writeFileSync(outputFile, html)
  }

  const redirectRoutes: SitemapRoute[] = []

  for (const [from, to] of Object.entries(LEGACY_ROUTE_REDIRECTS)) {
    if (!(from.endsWith('.html') || from.endsWith('/'))) {
      continue
    }

    const outputPath = toOutputPathFromRoute(from)
    const outputFile = join(distRoot, outputPath)

    if (!existsSync(outputFile)) {
      mkdirSync(dirname(outputFile), { recursive: true })
      writeFileSync(outputFile, renderRedirectHtml(to))
    }

    redirectRoutes.push({
      route: from,
      lastmod: new Date().toISOString(),
    })
  }

  const notFoundNavbar = renderNavbar(
    [
      ...siteConfig.locales['/'].navbar,
      {
        text: siteConfig.locales['/'].selectLanguageName,
        children: createLanguageItems('/', pageByRoute),
      },
    ],
    '/404.html',
    resolveConfigLink,
    'vp-navbar-items vp-hide-mobile'
  )

  const notFoundSidebar = renderNavbar(
    [
      ...siteConfig.locales['/'].navbar,
      {
        text: siteConfig.locales['/'].selectLanguageName,
        children: createLanguageItems('/', pageByRoute),
      },
    ],
    '/404.html',
    resolveConfigLink,
    'vp-navbar-items',
    true
  )

  const notFoundHtml = renderLayout({
    lang: 'en',
    title: '404 | FaasJS',
    description: siteConfig.locales['/'].description,
    homeLink: '/',
    hasSidebar: false,
    navbarHtml: notFoundNavbar,
    sidebarHtml: notFoundSidebar,
    contentHtml:
      '<div class="theme-default-content"><h1>404</h1><p>Page not found.</p><p><a class="route-link auto-link" href="/">Back to home</a></p></div>',
    gaId: siteConfig.gaId,
    adsScript: siteConfig.adsScript,
  })

  writeFileSync(join(distRoot, '404.html'), notFoundHtml)

  writeStaticAssets()

  const sitemapRoutes: SitemapRoute[] = [
    ...pages.map(page => ({
      route: page.routePath,
      lastmod: page.lastmod,
    })),
    ...redirectRoutes,
  ]

  writeFileSync(
    join(distRoot, 'sitemap.xml'),
    buildSitemapXml({
      routes: sitemapRoutes,
      hostname: siteConfig.hostname,
    })
  )

  writeFileSync(
    join(distRoot, 'routes.json'),
    JSON.stringify(
      sitemapRoutes
        .map(item => item.route)
        .sort((a, b) => {
          if (a === '/') return -1
          if (b === '/') return 1
          return a.localeCompare(b)
        }),
      null,
      2
    )
  )

  console.log(`Generated ${pages.length} pages into ${distRoot}`)
}

buildSite()
