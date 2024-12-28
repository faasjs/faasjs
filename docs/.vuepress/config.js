import { defineUserConfig } from '@vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { searchPlugin } from '@vuepress/plugin-search'
import { sitemapPlugin } from '@vuepress/plugin-sitemap'

export default defineUserConfig({
  lang: 'en',
  title: 'FaasJS',
  description: 'An atomic application framework built for the TypeScript developer.',
  head: [['link', { rel: 'icon', href: '/logo.jpg' }], ['script', {src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0049636498302507', crossorigin: 'anonymous'}]],
  locales: {
    '/': {
      lang: 'en',
      title: 'FaasJS',
      description: 'An atomic application framework built for the TypeScript developer.',
    },
    '/zh/': {
      lang: 'zh',
      title: 'FaasJS',
      description: '一个基于 Typescript 的原子化应用框架',
    },
  },
  bundler: viteBundler(),
  theme: defaultTheme({
    locales: {
      '/': {
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
                text: 'Starter Template',
                link: 'https://github.com/faasjs/starter',
              },
              {
                text: 'Changelog',
                link: '/CHANGELOG',
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
                link: '/CONTRIBUTING',
              },
              {
                text: 'Sponsor',
                link: 'https://github.com/sponsors/faasjs',
              },
              {
                text: 'Security',
                link: '/SECURITY',
              },
            ],
          },
        ],
        sidebar: {
          '/guide/': [
            '/guide/',
            '/guide/request-spec',
          ],
        }
      },
      '/zh/': {
        selectText: '选择语言',
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
                link: '/CHANGELOG',
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
                link: '/CONTRIBUTING.md',
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
            '/zh/guide/auth',
            {
              title: '进阶学习',
              collapsable: false,
              children: [
                '/zh/guide/excel/faas-yaml',
                '/zh/guide/excel/plugin',
                '/zh/guide/excel/http',
                '/zh/guide/excel/db',
                '/zh/guide/excel/request-spec',
                '/zh/guide/excel/env',
                '/zh/guide/excel/react',
              ],
            },
            '/zh/guide/story',
          ],
          '/zh/doc/': [
            ['', '总览'],
            {
              title: '核心插件',
              collapsable: false,
              children: ['func', 'cloud_function', 'test'],
            },
            {
              title: '命令行插件',
              collapsable: false,
              children: ['cli', 'create-faas-app'],
            },
            {
              title: '工具插件',
              collapsable: false,
              children: ['deep_merge', 'load', 'logger', 'request', 'server'],
            },
            {
              title: '网络插件',
              collapsable: false,
              children: ['http'],
            },
            {
              title: '数据库插件',
              collapsable: false,
              children: ['knex', 'redis'],
            },
            {
              title: '前端插件',
              collapsable: false,
              children: ['browser', 'react'],
            },
          ],
        },
        lastUpdatedText: '更新时间',
      },
    },
    contributors: false,
  }),
  plugins: [
    googleAnalyticsPlugin({
      id: 'UA-143006612-1',
    }),
    searchPlugin({
      locales: {
        '/': {
          placeholder: 'Search',
        },
        '/zh/': {
          placeholder: '搜索',
        },
      },
    }),
    sitemapPlugin({
      hostname: 'https://faasjs.com',
    })
  ],
})
