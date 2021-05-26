---
home: true
heroImage: logo.png
heroText: FaasJS
tagline: Serverless 比你想象的更简单
footer: A Node.js Severless Application Framework | MIT Licensed | Copyright © 2019-2021 Zhu Feng
---

### 一行指令创建项目

    yarn create faas-app --name faasjs --example --noprovider

### 查看生成的文件内容

```ts
/*
 * 云函数文件
 * index.func.ts
 */
import { useFunc } from '@faasjs/func';
import { useHttp } from '@faasjs/http';

export default useFunc(function(){
  useHttp(); // 使用 http 插件

  return async function () {
    return 'Hello, world'; // 返回的内容
  }
});
```

```ts
/*
 * 自动化测试脚本
 * __tests__/index.test.ts
 */
import { FuncWarpper } from '@faasjs/test';

describe('index', function () {
  test('should work', async function () {
    // 引用云函数文件
    const func = new FuncWarpper(require.resolve('../index.func'));
    // 模拟调用
    const res = await func.handler();

    // 检查响应内容
    expect(res.body).toEqual('{"data":"Hello, world"}');
  });
});
```

<div class="hero">
  <p class="action">
    <a href="/guide" class="nav-link action-button">探索更多 →</a>
  </p>
</div>

<div align="center" style="padding:0 2.5rem">
  <div>
  </div>
  <div class="features">
    <div style="flex-grow:1;flex-basis:100%;">
      <a href="https://github.com/faasjs/faasjs/blob/master/packages/faasjs/LICENSE"><img src="https://img.shields.io/npm/l/faasjs.svg"></a>
      <a href="https://www.npmjs.com/package/faasjs"><img src="https://img.shields.io/npm/v/faasjs/beta.svg"></a>
      <a href="https://codecov.io/gh/faasjs/faasjs"><img src="https://img.shields.io/codecov/c/github/faasjs/faasjs.svg"></a>
      <a href="https://github.com/faasjs/faasjs"><img src="https://img.shields.io/github/last-commit/faasjs/faasjs"></a>
      <br><br>本项目正在公测中，更新较频繁，<a href="/changelog.html">点击这里查看更新日志</a>。<br><br>欢迎关注公众号（寂静小站）或加入 QQ 群（772109193）交流反馈：
    </div>
    <div style="flex-grow:1;flex-basis:50%;margin-top:1em;"><img src="https://user-images.githubusercontent.com/215433/59484397-31098900-8ea4-11e9-9971-0fa0c7aafccb.jpg" alt="公众号 寂静小站" style="width:100%" /></div>
    <div style="flex-grow:1;flex-basis:50%;margin-top:1em;"><img src="https://user-images.githubusercontent.com/215433/66827694-cff0df80-ef81-11e9-88c6-3613842de14a.jpg" alt="QQ 群号 772109193" style="width:100%" /></div>
  </div>
  <hr style="clear:both;margin-top:2em">
  <div>
    <h3>感谢</h3>
    <p>代码贡献者（按字母排序）</p>
    <p><a href="https://github.com/onichandame" target="_blank">onichandame</a></p>
    <p><a href="https://github.com/Vibutnum" target="_blank">Vibutnum</a></p>
    <p><a href="https://github.com/victoryifei" target="_blank">victoryifei</a></p>
    <p><a href="https://github.com/zfben" target="_blank">zfben</a></p>
    <p>FaasJS 基于以下开源项目（按字母排序）</p>
    <p><a href="https://www.apollographql.com/" target="_blank">Apollo</a></p>
    <p><a href="https://babeljs.io/" target="_blank">Babel</a></p>
    <p><a href="https://eslint.org/" target="_blank">ESLint</a></p>
    <p><a href="https://jestjs.io/" target="_blank">Jest</a></p>
    <p><a href="https://jsdoc.app/" target="_blank">JSDoc</a></p>
    <p><a href="https://knexjs.org/" target="_blank">Knex</a></p>
    <p><a href="https://nodejs.org/" target="_blank">Node.js</a></p>
    <p><a href="https://nuxtjs.org/" target="_blank">Nuxt.js</a></p>
    <p><a href="https://reactjs.org/" target="_blank">React</a></p>
    <p><a href="https://rollupjs.org/" target="_blank">Rollup.js</a></p>
    <p><a href="https://typeorm.io/" target="_blank">TypeORM</a></p>
    <p><a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a></p>
    <p><a href="https://vuejs.org/" target="_blank">Vue.js</a></p>
    <p><a href="https://vuepress.vuejs.org/" target="_blank">VuePress</a></p>
  </div>
  <p><a href="https://beian.miit.gov.cn/" target="_blank" style="color:#4e6e8e;font-weight:200;font-size:0.8rem">沪ICP备15033310号</a></p>
</div>
