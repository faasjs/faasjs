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
      description:
        'A React-only, agent-friendly full-stack TypeScript framework for building predictable, type-safe applications with minimal dependencies.',
      footer:
        'A React-only, agent-friendly full-stack TypeScript framework for building predictable, type-safe applications with minimal dependencies. | MIT Licensed | Copyright © 2019-2026 Zhu Feng',
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
            children: [
              '/guidelines/project-config.html',
              '/guidelines/file-conventions.html',
              '/guidelines/code-comments.html',
              '/guidelines/define-api.html',
              '/guidelines/testing.html',
              '/guidelines/react.html',
              '/guidelines/react-data-fetching.html',
              '/guidelines/react-testing.html',
              '/guidelines/ant-design.html',
              '/guidelines/node-utils.html',
              '/guidelines/logger.html',
              '/guidelines/utils.html',
              '/guidelines/pg-query-builder.html',
              '/guidelines/pg-table-types.html',
              '/guidelines/pg-schema-and-migrations.html',
              '/guidelines/pg-testing.html',
            ],
          },
          {
            title: 'Specifications',
            collapsable: false,
            children: [
              '/specs/faas-yaml.html',
              '/specs/http-protocol.html',
              '/specs/plugin.html',
              '/specs/routing-mapping.html',
            ],
          },
        ],
        '/guidelines/': [
          ['/guide/', 'Guide'],
          '/guidelines/project-config.html',
          '/guidelines/file-conventions.html',
          '/guidelines/code-comments.html',
          '/guidelines/define-api.html',
          '/guidelines/testing.html',
          '/guidelines/react.html',
          '/guidelines/react-data-fetching.html',
          '/guidelines/react-testing.html',
          '/guidelines/ant-design.html',
          '/guidelines/node-utils.html',
          '/guidelines/logger.html',
          '/guidelines/utils.html',
          '/guidelines/pg-query-builder.html',
          '/guidelines/pg-table-types.html',
          '/guidelines/pg-schema-and-migrations.html',
          '/guidelines/pg-testing.html',
        ],
        '/specs/': [
          ['/guide/', 'Guide'],
          '/specs/faas-yaml.html',
          '/specs/http-protocol.html',
          '/specs/plugin.html',
          '/specs/routing-mapping.html',
        ],
      },
    },
    '/zh/': {
      lang: 'zh',
      title: 'FaasJS',
      description:
        '一个仅支持 React、对 Agent 友好的全栈 TypeScript 框架，用精简依赖构建可预测、类型安全的应用',
      footer:
        '一个仅支持 React、对 Agent 友好的全栈 TypeScript 框架，用精简依赖构建可预测、类型安全的应用 | MIT Licensed | Copyright © 2019-2026 Zhu Feng',
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
            children: [
              '/zh/guidelines/project-config.html',
              '/zh/guidelines/file-conventions.html',
              '/zh/guidelines/code-comments.html',
              '/zh/guidelines/define-api.html',
              '/zh/guidelines/testing.html',
              '/zh/guidelines/react.html',
              '/zh/guidelines/react-data-fetching.html',
              '/zh/guidelines/react-testing.html',
              '/zh/guidelines/ant-design.html',
              '/zh/guidelines/node-utils.html',
              '/zh/guidelines/logger.html',
              '/zh/guidelines/utils.html',
              '/zh/guidelines/pg-query-builder.html',
              '/zh/guidelines/pg-table-types.html',
              '/zh/guidelines/pg-schema-and-migrations.html',
              '/zh/guidelines/pg-testing.html',
            ],
          },
          {
            title: '规范索引',
            collapsable: false,
            children: [
              '/zh/specs/faas-yaml.html',
              '/zh/specs/http-protocol.html',
              '/zh/specs/plugin.html',
              '/zh/specs/routing-mapping.html',
            ],
          },
        ],
        '/zh/guidelines/': [
          ['/zh/guide/', '最佳实践'],
          '/zh/guidelines/project-config.html',
          '/zh/guidelines/file-conventions.html',
          '/zh/guidelines/code-comments.html',
          '/zh/guidelines/define-api.html',
          '/zh/guidelines/testing.html',
          '/zh/guidelines/react.html',
          '/zh/guidelines/react-data-fetching.html',
          '/zh/guidelines/react-testing.html',
          '/zh/guidelines/ant-design.html',
          '/zh/guidelines/node-utils.html',
          '/zh/guidelines/logger.html',
          '/zh/guidelines/utils.html',
          '/zh/guidelines/pg-query-builder.html',
          '/zh/guidelines/pg-table-types.html',
          '/zh/guidelines/pg-schema-and-migrations.html',
          '/zh/guidelines/pg-testing.html',
        ],
        '/zh/specs/': [
          ['/zh/guide/', '最佳实践'],
          '/zh/specs/faas-yaml.html',
          '/zh/specs/http-protocol.html',
          '/zh/specs/plugin.html',
          '/zh/specs/routing-mapping.html',
        ],
      },
    },
  },
}
