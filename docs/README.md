---
home: true
heroImage: /logo.jpg
heroText: 🚀 FaasJS
tagline: null
footer: 🚀 FaasJS is a Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications. | MIT Licensed | Copyright © 2019-2026 Zhu Feng
---

<div style="width:100%;line-height:1.7">
  <div style="text-align:center;font-size:1.6rem;color:#6a8bad;margin-bottom:1em">A Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications.</div>
  <div style="display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap">
    <a href="https://github.com/faasjs/faasjs/blob/main/packages/faasjs/LICENSE"><img src="https://img.shields.io/npm/l/faasjs.svg"></a>
    <br>
    <a href="https://www.npmjs.com/package/faasjs"><img src="https://img.shields.io/npm/v/faasjs.svg"></a>
    <br>
    <a href="https://github.com/faasjs/faasjs/actions/workflows/unit.yml"><img src="https://github.com/faasjs/faasjs/actions/workflows/unit.yml/badge.svg"></a>
    <a href="https://github.com/faasjs/faasjs/actions/workflows/lint.yml"><img src="https://github.com/faasjs/faasjs/actions/workflows/lint.yml/badge.svg"></a>
    <br>
    <a href="https://codecov.io/gh/faasjs/faasjs"><img src="https://img.shields.io/codecov/c/github/faasjs/faasjs.svg"></a>
    <a href="https://github.com/faasjs/faasjs"><img src="https://badgen.net/github/commits/faasjs/faasjs"></a>
    <br>
    <a href="https://github.com/faasjs/faasjs"><img src="https://badgen.net/github/last-commit/faasjs/faasjs"></a>
  </div>
</div>

<p style="max-width:760px;margin:0 auto 1em;text-align:center;line-height:1.8;color:#5c7080">FaasJS provides a chef-selected default path across React, Ant Design, typed APIs, PostgreSQL, validation, testing, plugins, and project conventions so teams can build predictable products without repeatedly assembling their own framework.</p>

<p style="max-width:760px;margin:0 auto 2em;text-align:center;line-height:1.8;color:#5c7080">The official frontend path is React. The curated business-app stack uses <code>@faasjs/ant-design</code> for UI, <code>@faasjs/pg</code> for PostgreSQL workflows, and agent-readable conventions for complete UI &rarr; API &rarr; DB &rarr; test slices.</p>

## Features

### Curated default stack

✅ React, Ant Design, PostgreSQL, Vitest, and Vite Plus working together.

✅ Strong defaults for database-driven admin panels, internal tools, SaaS dashboards, and BFF/API layers.

✅ Replaceable choices without turning alternatives into parallel first-class tracks.

### Typed full-stack workflow

✅ `defineApi` endpoints with explicit schemas and typed contracts.

✅ Shared API types across backend handlers and React clients.

✅ PostgreSQL query, migration, and testing workflows through `@faasjs/pg` and `@faasjs/pg-dev`.

### Agent-readable conventions

✅ Stable file conventions and routing rules.

✅ Complete application slices that are easy for humans and AI coding agents to inspect, review, and refactor.

✅ Plugin patterns for business-specific concerns such as auth context and permissions.

## Quick start

### Start with Codespaces and Templates

[🧪 FaasJS Templates](https://github.com/faasjs/faasjs/tree/main/templates)

### Start with Command Line

```bash
npx create-faas-app --name faasjs
npx create-faas-app --name faasjs-admin --template admin
npx create-faas-app --name faasjs-minimal --template minimal
```

`admin` is the default starter. It follows the curated FaasJS path with React, Ant Design, PostgreSQL, and `@faasjs/pg-dev`-powered tests. Use `--template minimal` when you want a lighter React starter without the database stack.

## Examples

### API file

```ts
// index.api.ts
// all API entry files should end with .api.ts
import { defineApi } from '@faasjs/core'

export default defineApi({
  async handler() {
    return 'Hello, world' // response content
  },
})
```

### Unit test's file

```ts
// __tests__/index.test.ts
// unit test files should end with .test.ts
// TSX-based UI tests should use .test.tsx
// UI tests without TSX should use .ui.test.ts
import { testApi } from '@faasjs/dev'
import api from '../index.api'

describe('index', function () {
  it('should work', async function () {
    // create a test handler
    const handler = testApi(api)

    // mock the request
    const { statusCode, data } = await handler()

    // expect the response with 200 status
    expect(statusCode).toEqual(200)
    // expect the response content is 'Hello, world'
    expect(data).toEqual('Hello, world')
  })
})
```

## Thanks

Code contributors (in alphabetical order):

<div style="display:flex;flex-wrap:wrap;gap:4px;">
  <a href="https://github.com/Germiniku" target="_blank">Germini</a>,
  <a href="https://github.com/hiisea" target="_blank">hiisea</a>,
  <a href="https://github.com/iHeyTang">iHeyTang</a>,
  <a href="https://github.com/luckyporo" target="_blank">luckyporo</a>,
  <a href="https://github.com/mingkang1993" target="_blank">mingkang1993</a>,
  <a href="https://github.com/minzojian" target="_blank">minzojian</a>,
  <a href="https://github.com/onichandame" target="_blank">onichandame</a>,
  <a href="https://github.com/Vibutnum" target="_blank">Vibutnum</a>,
  <a href="https://github.com/victoryifei" target="_blank">victoryifei</a>,
  <a href="https://github.com/WittCsharp" target="_blank">WittCsharp</a>,
  <a href="https://github.com/zfben" target="_blank">zfben</a>
</div>

Open source projects (in alphabetical order):

<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:2em">
  <a href="https://oxc.rs/" target="_blank">Oxc</a>,
  <a href="https://nodejs.org/" target="_blank">Node.js</a>,
  <a href="https://react.dev/" target="_blank">React</a>,
  <a href="https://rollupjs.org/" target="_blank">Rollup.js</a>,
  <a href="https://vitest.dev/" target="_blank">Vitest</a>,
  <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>
</div>
