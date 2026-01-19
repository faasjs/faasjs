# @faasjs/test

FaasJS 内置插件，无需额外安装。

此组件用于构建自动化测试。

## package.json 配置

可以在 package.json 中添加如下配置：

```json
{
  "scripts": {
    "test": "vitest run"
  },
  "vitest": {
    "coverage": {
      "provider": "v8",
      "include": ["**/*.ts"],
      "exclude": ["**/*.test.ts", "**/*.d.ts"]
    }
  }
}
```

## 命令行

在完成 `package.json` 配置后，可以使用以下命令进行自动化测试：

```bash
npm run test
```

## 编写测试用例

```typescript
// 引入 FaasJS 的测试函数
import { test } from '@faasjs/test'
// 引入云函数文件，假设云函数文件在 `../index.func`
import Func from '../index.func'

describe('hello', function () {
  test('should work', async function () {
    // 创建测试实例
    const func = test(Func)

    // 触发云函数
    const res = await func.handler({})

    // 校验响应结果
    expect(res.body).toEqual('{"data":"Hello, world"}')
  })
})
```

## 相关文档

- [Vitest](https://vitest.dev/)
- [Vitest Expect](https://vitest.dev/guide/assertion.html)
