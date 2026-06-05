import { buildManifest } from '../../packages/docgen/src/index.ts'

export type NavbarItem = {
  text: string
  link?: string
  children?: NavbarItem[]
}

export type SidebarGroup = {
  title: string
  collapsable?: boolean
  children: string[]
}

export type SidebarItem = string | [string, string] | SidebarGroup

export type LocaleConfig = {
  lang: string
  title: string
  description: string
  footer: string
  navbar: NavbarItem[]
  sidebar: Record<string, SidebarItem[]>
}

export type SiteConfig = {
  title: string
  gaId: string
  hostname: string
  adsScript: string
  locales: {
    '/': LocaleConfig
  }
}

const navigationManifest = buildManifest()
const enGuidelines = navigationManifest.pages
  .filter((page) => page.kind === 'guideline' && page.locale === 'en')
  .map((page) => page.routePath)
const enSpecs = navigationManifest.pages
  .filter((page) => page.kind === 'spec' && page.locale === 'en')
  .map((page) => page.routePath)

export const siteConfig: SiteConfig = {
  title: 'FaasJS',
  gaId: 'UA-143006612-1',
  hostname: 'https://faasjs.com',
  adsScript:
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0049636498302507',
  locales: {
    '/': {
      lang: 'en',
      title: 'FaasJS',
      description:
        'A Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications.',
      footer:
        'A Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications. | MIT Licensed | Copyright © 2019-2026 Zhu Feng',
      navbar: [
        {
          text: 'Home',
          link: '/',
        },
        {
          text: 'Learn',
          children: [
            {
              text: 'Guide',
              link: '/guidelines/',
            },
            {
              text: 'Documents',
              link: '/doc/',
            },
            {
              text: 'Templates',
              link: 'https://github.com/faasjs/faasjs/tree/main/templates',
            },
            {
              text: 'Changelog',
              link: '/CHANGELOG.html',
            },
            {
              text: 'Ecosystem',
              children: [
                {
                  text: 'Docker Images',
                  link: '/doc/images/',
                },
              ],
            },
          ],
        },
        {
          text: 'Community',
          children: [
            {
              text: 'Github',
              link: 'https://github.com/faasjs/faasjs/',
            },
            {
              text: 'Contributing',
              link: '/CONTRIBUTING.html',
            },
            {
              text: 'Sponsor',
              link: 'https://github.com/sponsors/faasjs',
            },
            {
              text: 'Security',
              link: '/SECURITY.html',
            },
          ],
        },
      ],
      sidebar: {
        '/guidelines/': enGuidelines,
        '/specs/': enSpecs,
      },
    },
  },
}
