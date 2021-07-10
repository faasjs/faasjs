module.exports = {
  title: 'FaasJS',
  description: 'An atomic FaaS Application Framework based on Typescript and Node.js',
  head: [
    ['link', { rel: 'icon', href: '/logo.ico' }]
  ],
  shouldPrefetch: () => false,
  themeConfig: {
    smoothScroll: true,
    nav: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '教程',
        link: '/guide/'
      },
      {
        text: '文档',
        link: '/doc/'
      },
      {
        text: '示例',
        link: '/example/'
      },
      {
        text: '支持 FaasJS',
        link: 'https://github.com/faasjs/faasjs/blob/master/CONTRIBUTING.md'
      },
      {
        text: '更新日志',
        link: 'https://github.com/faasjs/faasjs/blob/master/CHANGELOG.md'
      }
    ],
    sidebar: {
      '/guide/': [
        '',
        'tencentcloud',
        'auth',
        {
          title: '进阶学习',
          collapsable: false,
          children: [
            'excel/faas-yaml',
            'excel/plugin',
            'excel/http',
            'excel/db',
            'excel/request-spec',
            'excel/env',
            'excel/test',
            'excel/lint',
            'excel/vue',
            'excel/react',
            'excel/graphql-server',
          ]
        },
        'story'
      ],
      '/doc/': [
        ['', '总览'],
        {
          title: '核心插件',
          collapsable: false,
          children: [
            'func',
            'cloud_function',
            'deployer',
            'test',
          ]
        },
        {
          title: '命令行插件',
          collapsable: false,
          children: [
            'cli',
            'create-faas-app'
          ]
        },
        {
          title: '工具插件',
          collapsable: false,
          children: [
            'deep_merge',
            'load',
            'logger',
            'request',
            'server',
          ]
        },
        {
          title: '代码风格插件',
          collapsable: false,
          children: [
            'eslint-config-react',
            'eslint-config-recommended',
            'eslint-config-vue',
          ]
        },
        {
          title: '网络插件',
          collapsable: false,
          children: [
            'http',
            'graphql-server',
          ]
        },
        {
          title: '数据库插件',
          collapsable: false,
          children: [
            'kafka',
            'knex',
            'mongo',
            'redis',
            'sql',
          ]
        },
        {
          title: '服务商适配插件',
          collapsable: false,
          children: [
            'tencentcloud'
          ]
        },
        {
          title: '前端插件',
          collapsable: false,
          children: [
            'browser',
            'react',
            'vue-plugin',
          ]
        },
      ],
      '/example/': [
        '',
        'cloud-function',
        'http-basic',
        'cron-basic',
        'sql-knex'
      ]
    },
    search: true,
    lastUpdated: '更新时间',
    repo: 'faasjs/faasjs',
    docsRepo: 'faasjs/faasjs',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '帮助我们改善此页面'
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-143006612-1'
      }
    ]
  ],
  evergreen: true
}
