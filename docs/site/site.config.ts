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
  selectLanguageName: string
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
    '/zh/': LocaleConfig
  }
}

const navigationManifest = buildManifest()
const enGuidelines = navigationManifest.pages
  .filter((page) => page.kind === 'guideline')
  .map((page) => page.routePath)
const enSpecs = navigationManifest.pages
  .filter((page) => page.kind === 'spec')
  .map((page) => page.routePath)
const zhGuidelines = enGuidelines.map((link) => `/zh${link}`)
const zhSpecs = enSpecs.map((link) => `/zh${link}`)

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
      selectLanguageName: 'English',
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
              link: '/guide/',
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
        '/guide/': [
          '/guide/',
          {
            title: 'Guidelines',
            collapsable: false,
            children: enGuidelines,
          },
          {
            title: 'Specifications',
            collapsable: false,
            children: enSpecs,
          },
        ],
        '/guidelines/': [['/guide/', 'Guide'], ...enGuidelines],
        '/specs/': [['/guide/', 'Guide'], ...enSpecs],
      },
    },
    '/zh/': {
      lang: 'zh',
      title: 'FaasJS',
      description: '一个受 Rails 启发的精选式全栈 TypeScript 框架，面向数据库驱动的 React 业务应用',
      footer:
        '一个受 Rails 启发的精选式全栈 TypeScript 框架，面向数据库驱动的 React 业务应用 | MIT Licensed | Copyright © 2019-2026 Zhu Feng',
      selectLanguageName: '简体中文',
      navbar: [
        {
          text: '首页',
          link: '/zh/',
        },
        {
          text: '学习',
          children: [
            {
              text: '教程',
              link: '/zh/guide/',
            },
            {
              text: '文档',
              link: '/doc/',
            },
            {
              text: '更新日志',
              link: '/CHANGELOG.html',
            },
          ],
        },
        {
          text: '生态',
          children: [
            {
              text: 'Docker 镜像',
              children: [
                {
                  text: 'faasjs/nginx',
                  link: 'https://github.com/faasjs/faasjs/tree/main/images/nginx',
                },
                {
                  text: 'faasjs/node',
                  link: 'https://github.com/faasjs/faasjs/tree/main/images/node',
                },
                {
                  text: 'faasjs/vscode',
                  link: 'https://github.com/faasjs/faasjs/tree/main/images/vscode',
                },
              ],
            },
          ],
        },
        {
          text: '社区',
          children: [
            {
              text: 'Github',
              link: 'https://github.com/faasjs/faasjs/',
            },
            {
              text: '支持 FaasJS',
              link: '/CONTRIBUTING.html',
            },
            {
              text: '赞助 FaasJS',
              link: 'https://github.com/sponsors/faasjs',
            },
          ],
        },
      ],
      sidebar: {
        '/zh/guide/': [
          '/zh/guide/',
          {
            title: '指南索引',
            collapsable: false,
            children: zhGuidelines,
          },
          {
            title: '规范索引',
            collapsable: false,
            children: zhSpecs,
          },
        ],
        '/zh/guidelines/': [['/zh/guide/', '最佳实践'], ...zhGuidelines],
        '/zh/specs/': [['/zh/guide/', '最佳实践'], ...zhSpecs],
      },
    },
  },
}
