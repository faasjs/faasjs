---
home: true
heroImage: /logo.jpg
heroText: 🚀 FaasJS
tagline: null
footer: 🚀 FaasJS is a React-only, agent-friendly full-stack TypeScript framework for building predictable, type-safe applications with minimal dependencies. | MIT Licensed | Copyright © 2019-2026 Zhu Feng
---

<div style="width:100%;line-height:1.7">
  <div style="text-align:center;font-size:1.6rem;color:#6a8bad;margin-bottom:1em">A React-only, agent-friendly full-stack TypeScript framework for building predictable, type-safe applications with minimal dependencies.</div>
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

<p style="max-width:760px;margin:0 auto 1em;text-align:center;line-height:1.8;color:#5c7080">FaasJS helps you ship React-based full-stack products faster through a strong default path across frontend, backend, and shared types, safer refactoring, and a smaller dependency surface that is easier to trust, audit, and maintain.</p>

<p style="max-width:760px;margin:0 auto 2em;text-align:center;line-height:1.8;color:#5c7080">The official main path is React, with <code>@faasjs/ant-design</code> as the recommended UI happy path for common business systems and <code>@faasjs/pg</code> as the recommended relational database path.</p>

## Features

### Predictable for humans and agents

✅ Clear file conventions and routing rules.

✅ Less ambiguity in generation, review, and maintenance.

✅ Better collaboration across developers and tools.

### Type-safe by default

✅ TypeScript-first application architecture.

✅ Safer APIs and clearer contracts.

✅ More confident refactoring over time.

### Lean dependency model

✅ Minimal external dependencies.

✅ Smaller supply-chain attack surface.

✅ Easier upgrades and dependency review.

## Quick start

### Start with Codespaces and Templates

[🧪 FaasJS Templates](https://github.com/faasjs/faasjs/tree/main/templates)

### Start with Command Line

```bash
npx create-faas-app --name faasjs
npx create-faas-app --name faasjs-admin --template antd
```

`basic` is the default starter. Use `--template antd` when you want the recommended Ant Design app shell for common business systems.

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
