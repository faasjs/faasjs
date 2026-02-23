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
      description: 'An atomic application framework built for the TypeScript developer.',
      footer:
        'An atomic application framework built for the TypeScript developer. | MIT Licensed | Copyright © 2019-2026 Zhu Feng',
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
              text: 'Examples',
              link: 'https://github.com/faasjs/faasjs/tree/main/examples',
            },
            {
              text: 'Changelog',
              link: '/CHANGELOG.html',
            },
            {
              text: 'Ecosystem',
              children: [
                {
                  text: 'VS Code Plugin',
                  link: 'https://marketplace.visualstudio.com/items?itemName=FaasJS.faasjs-snippets',
                },
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
        '/guide/': ['/guide/', '/guide/request-spec', '/guide/Dockerize'],
      },
    },
    '/zh/': {
      lang: 'zh',
      title: 'FaasJS',
      description: '一个基于 Typescript 的原子化应用框架',
      footer:
        '一个基于 TypeScript 的原子化应用框架 | MIT Licensed | Copyright © 2019-2026 Zhu Feng',
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
              link: '/zh/doc/',
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
              text: 'VS Code 插件',
              link: 'https://marketplace.visualstudio.com/items?itemName=FaasJS.faasjs-snippets',
            },
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
          '/zh/guide/auth.html',
          {
            title: '进阶学习',
            collapsable: false,
            children: [
              '/zh/guide/excel/faas-yaml.html',
              '/zh/guide/excel/plugin.html',
              '/zh/guide/excel/http.html',
              '/zh/guide/excel/db.html',
              '/zh/guide/excel/request-spec.html',
              '/zh/guide/excel/env.html',
              '/zh/guide/excel/react.html',
            ],
          },
          '/zh/guide/story.html',
        ],
      },
    },
  },
}
