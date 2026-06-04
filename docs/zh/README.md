---
home: true
heroImage: /logo.jpg
heroText: FaasJS
tagline: null
footer: 一个受 Rails 启发、精选的全栈 TypeScript 框架，专为数据库驱动的 React 业务应用而设计 | MIT Licensed | Copyright © 2019-2026 Zhu Feng
---

<div style="width:100%;text-align:center;font-size:1.6rem;line-height:2;color:#6a8bad;margin-bottom:.75em">一个受 Rails 启发、精选的全栈 TypeScript 框架，专为数据库驱动的 React 业务应用而设计</div>

<p style="max-width:760px;margin:0 auto 1em;text-align:center;line-height:1.8;color:#5c7080">FaasJS 为 React、Ant Design、类型化 API、PostgreSQL、验证、测试、插件和项目约定提供一条“主厨精选”的默认路径，让团队不用反复组装自己的业务应用框架。</p>

<p style="max-width:760px;margin:0 auto 2em;text-align:center;line-height:1.8;color:#5c7080">官方前端路径是 React。精选业务应用栈使用 <code>@faasjs/ant-design</code> 构建业务 UI，使用 <code>@faasjs/pg</code> 处理 PostgreSQL 工作流，并通过对 Agent 友好的约定组织完整的 UI &rarr; API &rarr; DB &rarr; test 切片。</p>

## 为什么选择 FaasJS？

FaasJS 面向的是更常见、但经常被低估的业务软件：管理后台、运营系统、内部工具、SaaS 控制台、BFF/API 层和业务工作流应用。

它不是 Next.js 或 TanStack Start 的通用替代品。Next.js 和 TanStack Start 更关注渲染模型、路由、缓存、Server Functions 和部署体验。FaasJS 则刻意更窄：它关注数据库驱动的 React 业务应用如何用一条官方路径打通 UI、API、验证、PostgreSQL、后台任务、测试和项目约定。

在 FaasJS 中，一个功能通常应该作为完整应用切片落地：

```text
src/db/migrations/20250101000000_create_users.ts
src/db/tables/users.ts
src/features/users/index.tsx
src/features/users/api/list.api.ts
src/features/users/api/create.api.ts
src/features/users/api/__tests__/list.test.ts
src/features/users/api/__tests__/create.test.ts
```

这种结构让人类维护者和 AI 编码代理都更容易一起查找、评审和修改业务行为。

## 特性

### 精选默认栈

✅ React、Ant Design、PostgreSQL、Vitest 和 Vite Plus 协同工作。

✅ 针对管理后台、内部工具、SaaS 仪表盘和 BFF/API 层提供强默认值。

✅ 允许替换技术选择，但不会把所有替代方案都变成并行的一等路径。

### 类型化全栈工作流

✅ 使用 `defineApi` 编写带显式 schema 和类型契约的后端端点。

✅ 后端 handler 与 React 客户端共享 API 类型。

✅ 通过 `@faasjs/pg` 和 `@faasjs/pg-dev` 支持 PostgreSQL 查询、迁移和测试工作流。

### 对 Agent 友好的约定

✅ 稳定的文件约定和路由规则。

✅ 完整应用切片便于人类和 AI 编码代理一起检查、评审和重构。

✅ 使用插件模式承载认证上下文、权限等业务特定横切关注点。

## 最适合的场景

- 管理后台和后台运营系统
- 内部工具和业务工作流应用
- SaaS 仪表盘和需要登录的产品控制台
- 基于 PostgreSQL 的 BFF/API 层
- 需要仪表盘、任务、API 或运营流程的 AI 产品界面

如果你的项目主要是内容站、营销页、高度定制的 C 端前端，或者核心关注点是 React Server Components 与特定部署平台的渲染优化，FaasJS 也可以支持，但这不是它的设计中心。

## 快速开始

### 从 Codespaces 与模板开始

[🧪 FaasJS Templates](https://github.com/faasjs/faasjs/tree/main/templates)

### 从命令行开始

```bash
npx create-faas-app --name faasjs
npx create-faas-app --name faasjs-admin --template admin
npx create-faas-app --name faasjs-minimal --template minimal
```

默认模板是 `admin`：它按官方推荐路径预装了 React、Ant Design、PostgreSQL，以及基于 `@faasjs/pg-dev` 的测试环境。如果你想要一个不带数据库栈的轻量 React starter，可以使用 `--template minimal`。

## 代码示例

### API 文件

```ts
// index.api.ts
// API 入口文件都以 .api.ts 结尾
import { defineApi } from '@faasjs/core'

export default defineApi({
  async handler() {
    return 'Hello, world' // 返回的内容
  },
})
```

### 单元测试文件

```ts
// __tests__/index.test.ts
// 普通单元测试文件以 .test.ts 结尾
// 带 TSX 的 UI 测试使用 .test.tsx
// 不带 TSX 的 UI 测试使用 .ui.test.ts
import { testApi } from '@faasjs/dev'
import api from '../index.api'

describe('index', function () {
  it('should work', async function () {
    // 创建测试 handler
    const handler = testApi(api)

    // 模拟请求
    const { statusCode, data } = await handler()

    // 断言返回 200 状态
    expect(statusCode).toEqual(200)
    // 断言返回内容为 'Hello, world'
    expect(data).toEqual('Hello, world')
  })
})
```

<div style="padding:0 2.5rem;text-align:center">
  <div class="features">
    <div style="flex-grow:1;flex-basis:100%;line-height:1.6">
      <a href="https://github.com/faasjs/faasjs"><img src="https://badgen.net/github/last-commit/faasjs/faasjs"></a>
      <br>
      <a href="https://github.com/faasjs/faasjs/blob/main/packages/faasjs/LICENSE"><img src="https://img.shields.io/npm/l/faasjs.svg"></a>
      <a href="https://www.npmjs.com/package/faasjs"><img src="https://img.shields.io/npm/v/faasjs/beta.svg"></a>
      <br>
      <a href="https://github.com/faasjs/faasjs/actions/workflows/unit.yml"><img src="https://github.com/faasjs/faasjs/actions/workflows/unit.yml/badge.svg"></a>
      <a href="https://github.com/faasjs/faasjs/actions/workflows/lint.yml"><img src="https://github.com/faasjs/faasjs/actions/workflows/lint.yml/badge.svg"></a>
      <br>
      <a href="https://codecov.io/gh/faasjs/faasjs"><img src="https://img.shields.io/codecov/c/github/faasjs/faasjs.svg"></a>
      <a href="https://github.com/faasjs/faasjs"><img src="https://badgen.net/lgtm/lines/g/faasjs/faasjs"></a>
      <a href="https://github.com/faasjs/faasjs"><img src="https://badgen.net/github/commits/faasjs/faasjs"></a>
    </div>
    <div style="margin:1em auto"><div>欢迎关注 FaasJS 作者的公众号（寂静小站）与我交流：</div><img src="https://user-images.githubusercontent.com/215433/59484397-31098900-8ea4-11e9-9971-0fa0c7aafccb.jpg" alt="公众号 寂静小站" /></div>
  </div>
  <hr style="clear:both">
  <div style="margin-bottom:2em">
    <h3>感谢</h3>
    <p>代码贡献者（按字母排序）</p>
    <a href="https://github.com/Germiniku" target="_blank">Germini</a>,
    <a href="https://github.com/hiisea" target="_blank">hiisea</a>,
    <a href="https://github.com/luckyporo" target="_blank">luckyporo</a>,
    <a href="https://github.com/mingkang1993" target="_blank">mingkang1993</a>,
    <a href="https://github.com/minzojian" target="_blank">minzojian</a>,
    <a href="https://github.com/onichandame" target="_blank">onichandame</a>,
    <a href="https://github.com/Vibutnum" target="_blank">Vibutnum</a>,
    <a href="https://github.com/victoryifei" target="_blank">victoryifei</a>,
    <a href="https://github.com/zfben" target="_blank">zfben</a>
    <p>FaasJS 基于以下开源项目（按字母排序）</p>
    <a href="https://www.apollographql.com/" target="_blank">Apollo</a>,
    <a href="https://oxc.rs/" target="_blank">Oxc</a>,
    <a href="https://vitest.dev/" target="_blank">Vitest</a>,
    <a href="https://nodejs.org/" target="_blank">Node.js</a>,
    <a href="https://rollupjs.org/" target="_blank">Rollup.js</a>,
    <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>
  </div>
</div>
