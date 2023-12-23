---
home: true
heroImage: /logo.jpg
heroText: FaasJS
tagline: null
footer: An Atomic Application Framework based on Typescript | MIT Licensed | Copyright © 2019-2024 Zhu Feng
---

<div style="width:100%;line-height:1.7">
  <div style="text-align:center;font-size:1.6rem;color:#6a8bad;margin-bottom:1em">An Atomic Application Framework based on Typescript.</div>
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

## Features

### High development efficiency

The atomized development model can reduce development and iteration to a featherweight level and is more friendly to team development.

FaasJS officially provides plugins such as HTTP, Knex, etc., so that developers can start developing business immediately.

### High maintainability

The FaaS architecture guarantees the independence between cloud functions and prevents a single error from causing the failure of the entire system.

FaasJS has built-in automated testing tools to facilitate developers to automate the testing of cloud functions.

### High scalability

FaasJS has a simple and easy-to-use plug-in mechanism that allows developers to extend functions and plugins freely.

## Example

### Cloud function's file

```ts
// index.func.ts
// all cloud function file should be ended with .func.ts
import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export default useFunc(function() {
  useHttp() // use http plugin

  return async function () {
    return 'Hello, world' // response content
  }
})
```

### Unit test's file

```ts
// __tests__/index.test.ts
// all unit test file should be ended with .test.ts
import { FuncWarper } from '@faasjs/test'
import Func from '../index.func'

describe('index', function () {
  test('should work', async function () {
    // wrap the cloud function
    const func = new FuncWarper(Func);

    // mock the request
    const { statusCode, data } = await func.JSONhandler()

    // expect the response with 200 status
    expect(statusCode).toEqual(200)
    // expect the response content is 'Hello, world'
    expect(data).toEqual('Hello, world')
  });
});
```

## Quickstart

```bash
npx create-faas-app --name faasjs --example --noprovider
```

## Playground

[Fork and open in codespace or your computer.](https://github.com/faasjs/starter)

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
  <a href="https://biomejs.dev/" target="_blank">Biome</a>,
  <a href="https://jestjs.io/" target="_blank">Jest</a>,
  <a href="https://knexjs.org/" target="_blank">Knex</a>,
  <a href="https://nodejs.org/" target="_blank">Node.js</a>,
  <a href="https://react.dev/" target="_blank">React</a>,
  <a href="https://rollupjs.org/" target="_blank">Rollup.js</a>,
  <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>,
  <a href="https://vuepress.vuejs.org/" target="_blank">VuePress</a>
</div>
