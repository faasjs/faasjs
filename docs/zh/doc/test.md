# @faasjs/test

FaasJS 内置插件，无需额外安装。

此组件用于构建自动化测试。

## package.json 配置

可以在 package.json 中添加如下配置：

```json
"jest": {
  "verbose": false,
  "transform": {
    ".(jsx|tsx?)": "@faasjs/jest"
  },
  "collectCoverageFrom": [
    "**/*.ts"
  ],
  "testRegex": "/*\\.test\\.ts$",
  "modulePathIgnorePatterns": [
    "/tmp/"
  ],
  "setupFilesAfterEnv": [
    "@faasjs/test/lib/jest.setup.js"
  ]
}
```

## 命令行

在完成 `package.json` 配置后，可以使用以下命令进行自动化测试：

```bash
  npm exec jest
```

## 编写测试用例

```typescript
// 引入 FaasJS 的测试函数封装类
import { FuncWarper } from '@faasjs/test'
// 引入云函数文件，假设云函数文件在 `../index.func`
import Func from '../index.func'

describe('hello', function () {
  test('should work', async function () {
    // 读取目标云函数文件
    const func = new FuncWarper(Func)

    // 触发云函数
    const res = await func.handler({})

    // 校验响应结果
    expect(res.body).toEqual('{"data":"Hello, world"}')
  })
})
```

## 相关文档

- [Jest](https://jestjs.io/)
- [Jest Expect](https://jestjs.io/docs/en/expect)
