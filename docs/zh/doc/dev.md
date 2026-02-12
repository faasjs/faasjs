# @faasjs/dev

FaasJS 的开发工具插件，提供本地开发与测试能力。

## 安装

```bash
npm install @faasjs/dev
```

## 核心能力

- `viteFaasJsServer`：在 Vite 开发环境中以内置方式运行 FaasJS API。
- `createPgliteKnex` / `mountFaasKnex`：为测试场景快速挂载 PGlite 数据库。
- `test` / `FuncWarper`：包装云函数并在测试中直接调用。
- `streamToString`：将 ReadableStream 响应转换为字符串便于断言。

## 测试示例

```typescript
import { test } from '@faasjs/dev'
import Func from '../index.func'

describe('hello', function () {
  test('should work', async function () {
    const func = test(Func)

    const res = await func.handler({})

    expect(res.body).toEqual('{"data":"Hello, world"}')
  })
})
```

## 相关文档

- [Vitest](https://vitest.dev/)
- [Vitest Expect](https://vitest.dev/guide/assertion.html)
