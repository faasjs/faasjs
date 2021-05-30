# 自动化测试

自动化测试功能基于 [Jest](https://jestjs.io/) 实现，Jest 的语法请阅读 [Jest 文档](https://jestjs.io/docs/en/expect)。

为了避免与云函数文件的命名混淆，单元测试文件须放置于 `__tests__` 文件夹下，测试文件名须以 `.test.ts` 结尾。

## 配置 Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  collectCoverage: true,
  testRegex: '/*\\.test\\.ts$',
  coveragePathIgnorePatterns: [
    '/__tests__/'
  ],
  setupFiles: [
    '@faasjs/test/lib/jest.setup'
  ]
};
```

## 测试文件示例

```typescript
// 引入 FaasJS 的测试函数封装类
import { FuncWarpper } from '@faasjs/test';

describe('hello', function () {
  test('should work', async function () {
    // 读取目标云函数文件
    const func = new FuncWarpper(require.resolve('../hello.func'));

    // 触发云函数
    const res = await func.handler({});

    // 校验响应结果
    expect(res.body).toEqual('{"data":"Hello, world"}');
  });
});
```

## 配置方法

在 **package.json** 中添加：

```json
"jest": {
  "collectCoverage": true,
  "collectCoverageFrom": [
    "**/*.ts"
  ],
  "testRegex": "/*\\.test\\.ts$",
  "modulePathIgnorePatterns": [
    "/lib/",
    "/tmp/"
  ]
}
```

## 命令

```
yarn jest
```
