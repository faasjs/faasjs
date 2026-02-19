import { toAliasKey } from './site-utils.ts'

export type SitemapRoute = {
  route: string
  lastmod?: string
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getAlternateRoutes(route: string, routeSet: Set<string>, hostname: string): string {
  const isZh = route.startsWith('/zh/')
  const enRoute = isZh ? `/${route.slice('/zh/'.length)}` : route
  const normalizedEnRoute = enRoute === '//' ? '/' : enRoute
  const zhRoute = normalizedEnRoute === '/' ? '/zh/' : `/zh${normalizedEnRoute}`

  if (!routeSet.has(toAliasKey(normalizedEnRoute))) {
    return ''
  }

  if (!routeSet.has(toAliasKey(zhRoute))) {
    return ''
  }

  return `${`<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(
    `${hostname}${normalizedEnRoute}`,
  )}"/>`}${`<xhtml:link rel="alternate" hreflang="zh" href="${escapeXml(
    `${hostname}${zhRoute}`,
  )}"/>`}`
}

export function buildSitemapXml(options: { routes: SitemapRoute[]; hostname: string }): string {
  const routeSet = new Set(options.routes.map((item) => toAliasKey(item.route)))
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
  ]

  const sortedRoutes = [...options.routes].sort((a, b) => {
    if (a.route === '/') return -1
    if (b.route === '/') return 1
    return a.route.localeCompare(b.route)
  })

  for (const item of sortedRoutes) {
    const loc = `${options.hostname}${item.route}`
    const alternate = getAlternateRoutes(item.route, routeSet, options.hostname)
    const lastmod = item.lastmod ? `<lastmod>${escapeXml(item.lastmod)}</lastmod>` : ''
    lines.push(
      `<url><loc>${escapeXml(loc)}</loc>${lastmod}<changefreq>daily</changefreq>${alternate}</url>`,
    )
  }

  lines.push('</urlset>')
  return lines.join('')
}
