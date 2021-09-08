---
home: true
heroImage: logo.png
heroText: FaasJS
tagline: null
footer: An atomic FaaS Application Framework based on Typescript & Node.js | MIT Licensed | Copyright © 2019-2021 Zhu Feng
---

<div style="width:100%;text-align:center;font-size:1.6rem;line-height:1;color:#6a8bad;margin-bottom:2em">基于 Typescript 和 Node.js 的原子化 FaaS 应用框架</div>

## 为什么要使用 FaasJS ？

### 开发效率高

原子化的开发模式，可以让开发和迭代降低到羽量级的程度，对团队开发也更友好。

FaasJS 官方提供了诸如 HTTP、Knex 等插件，使开发者可以立刻上手开发业务。

### 可维护性高

FaaS 架构保证了云函数之间的独立性，避免单一错误导致整个系统的故障。

FaasJS 内置自动化测试工具，方便开发者对云函数进行自动化测试。

### 可扩展性高

FaasJS 拥有简单易用的插件机制，可以让开发者可以自由扩展功能和插件。

## 代码示例

### 云函数文件

```ts
// index.func.ts 文件，云函数文件名都以 .func.ts 结尾
import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export default useFunc(function() {
  useHttp() // 引入 http 插件

  return async function () {
    return 'Hello, world' // 返回的内容
  }
})
```

## 单元测试文件

```ts
// __tests__/index.test.ts 文件，单元测试文件名都以 .test.ts 结尾
import { FuncWarpper } from '@faasjs/test'
import Func from '../index.func'

describe('index', function () {
  test('should work', async function () {
    // 引用云函数文件
    const func = new FuncWarpper(Func);

    // 模拟调用
    const { statusCode, data } = await func.JSONhandler()

    // 返回 200 状态
    expect(statusCode).toEqual(200)
    // 返回的 data 内容为 'Hello, world'
    expect(data).toEqual('Hello, world')
  });
});
```

## 立即开始

```bash
yarn create faas-app --name faasjs --example --noprovider
```

<div style="padding:0 2.5rem;text-align:center">
  <div class="features">
    <div style="flex-grow:1;flex-basis:100%;line-height:1.6">
      <a href="https://github.com/faasjs/faasjs"><img src="https://badgen.net/github/last-commit/faasjs/faasjs"></a>
      <br>
      <a href="https://github.com/faasjs/faasjs/blob/master/packages/faasjs/LICENSE"><img src="https://img.shields.io/npm/l/faasjs.svg"></a>
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
  <div>
    <h3>感谢</h3>
    <p>代码贡献者（按字母排序）</p>
    <a href="https://github.com/luckyporo" target="_blank">luckyporo</a>
    <a href="https://github.com/onichandame" target="_blank">onichandame</a>
    <a href="https://github.com/Vibutnum" target="_blank">Vibutnum</a>
    <a href="https://github.com/victoryifei" target="_blank">victoryifei</a>
    <a href="https://github.com/zfben" target="_blank">zfben</a>
    <p>FaasJS 基于以下开源项目（按字母排序）</p>
    <a href="https://www.apollographql.com/" target="_blank">Apollo</a>
    <a href="https://babeljs.io/" target="_blank">Babel</a>
    <a href="https://eslint.org/" target="_blank">ESLint</a>
    <a href="https://jestjs.io/" target="_blank">Jest</a>
    <a href="https://jsdoc.app/" target="_blank">JSDoc</a>
    <a href="https://knexjs.org/" target="_blank">Knex</a>
    <a href="https://nodejs.org/" target="_blank">Node.js</a>
    <a href="https://reactjs.org/" target="_blank">React</a>
    <a href="https://rollupjs.org/" target="_blank">Rollup.js</a>
    <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>
    <a href="https://vuejs.org/" target="_blank">Vue.js</a>
    <a href="https://vuepress.vuejs.org/" target="_blank">VuePress</a>
  </div>
  <p><a href="https://beian.miit.gov.cn/" target="_blank" style="color:#4e6e8e;font-weight:200;font-size:0.8rem">沪ICP备15033310号</a></p>
</div>
