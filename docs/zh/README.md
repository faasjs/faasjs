---
home: true
heroImage: /logo.jpg
heroText: FaasJS
tagline: null
footer: 一个仅支持 React、对 Agent 友好的全栈 TypeScript 框架，用精简依赖构建可预测、类型安全的应用 | MIT Licensed | Copyright © 2019-2026 Zhu Feng
---

<div style="width:100%;text-align:center;font-size:1.6rem;line-height:2;color:#6a8bad;margin-bottom:.75em">一个仅支持 React、对 Agent 友好的全栈 TypeScript 框架，用精简依赖构建可预测、类型安全的应用</div>

<p style="max-width:760px;margin:0 auto 1em;text-align:center;line-height:1.8;color:#5c7080">FaasJS 通过覆盖前端、后端与共享类型的稳定默认路径、清晰约定、更安全的重构体验和更小的依赖面，帮助你更快交付基于 React 的全栈产品，也让依赖更容易信任、审计与维护。</p>

<p style="max-width:760px;margin:0 auto 2em;text-align:center;line-height:1.8;color:#5c7080">官方主路径基于 React；对常见业务系统，<code>@faasjs/ant-design</code> 是推荐的 UI 主路径，<code>@faasjs/pg</code> 是推荐的关系型数据库路径。</p>

## 特性

### 对开发者和 Agent 都更可预测

✅ 清晰的文件约定与路由规则。

✅ 减少生成、评审与维护时的歧义。

✅ 让开发者与工具之间的协作更顺畅。

### 默认类型安全

✅ 以 TypeScript 为先的应用架构。

✅ 更安全的 API 与更清晰的契约。

✅ 随着项目演进，也能更有信心地重构。

### 精简依赖模型

✅ 尽量减少外部依赖。

✅ 更小的供应链攻击面。

✅ 更容易升级、审计和管理依赖。

## 快速开始

### 从 Codespaces 与模板开始

[🧪 FaasJS Templates](https://github.com/faasjs/faasjs/tree/main/templates)

### 从命令行开始

```bash
npx create-faas-app --name faasjs
npx create-faas-app --name faasjs-admin --template antd
```

默认模板是 `basic`，如果你需要面向常见业务系统的推荐 Ant Design 应用骨架，可以加上 `--template antd`。

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
