# Utils 指南

当你在应用代码、测试或运行时适配器中需要使用 `@faasjs/utils` 的轻量级辅助函数时，请参考本指南。

## 适用场景

- 递归合并配置对象
- 将文本或 JSON 与流之间相互转换
- 编写可在 Node.js、浏览器和边缘运行时中跨平台运行的便携辅助代码

## `@faasjs/utils` 提供的能力

- `deepMerge`：合并嵌套对象和数组而不修改输入
- `stringToStream`：将纯文本转换为 UTF-8 `ReadableStream`
- `streamToString`：将文本流读取回字符串
- `objectToStream`：将 JSON 数据序列化为流
- `streamToObject`：从流中解析 JSON 数据

## 常见模式

### 1. 合并默认值与覆盖值

- 当你需要从默认值、环境变量和每个请求的覆盖值中生成最终配置对象时，使用 `deepMerge`。
- 后面的值优先。嵌套对象递归合并。数组会去重，更新的项在前。

```ts
import { deepMerge } from '@faasjs/utils'

const defaults = {
  auth: {
    required: true,
    roles: ['user'],
  },
  features: ['search'],
}

const overrides = {
  auth: {
    roles: ['admin'],
  },
  features: ['export'],
}

const config = deepMerge(defaults, overrides)

config
// {
//   auth: {
//     required: true,
//     roles: ['admin', 'user'],
//   },
//   features: ['export', 'search'],
// }
```

### 2. 从文本或 JSON 构建流主体

- 对原始文本使用 `stringToStream`。
- 对 JSON 使用 `objectToStream`，这样你就不需要自己调用 `JSON.stringify()`。

```ts
import { objectToStream, stringToStream } from '@faasjs/utils'

const textBody = stringToStream('hello from FaasJS')
const jsonBody = objectToStream({
  ok: true,
  user: {
    id: 1,
    name: 'admin',
  },
})
```

### 3. 将流主体读取回可用数据

- 对文本负载使用 `streamToString`。
- 对 JSON 负载使用 `streamToObject`。

```ts
import { objectToStream, streamToObject, streamToString, stringToStream } from '@faasjs/utils'

const text = await streamToString(stringToStream('hello'))
const result = await streamToObject<{ ok: boolean }>(objectToStream({ ok: true }))

console.log(text) // 'hello'
console.log(result.ok) // true
```

### 4. 选择匹配的辅助函数对

- `stringToStream` 与 `streamToString` 配对使用
- `objectToStream` 与 `streamToObject` 配对使用
- 结构化数据优先使用 JSON 对，原始正文内容优先使用文本对

## 审查清单

- 仅在实际需要递归合并时才使用 `deepMerge`
- 文本负载使用文本流辅助函数
- JSON 负载使用对象流辅助函数
- 示例和测试选择最小的辅助函数，保持意图清晰

## 延伸阅读

- [@faasjs/utils 包参考](/doc/utils/)
- [deepMerge](/doc/utils/functions/deepMerge.html)
- [objectToStream](/doc/utils/functions/objectToStream.html)
- [streamToObject](/doc/utils/functions/streamToObject.html)
- [streamToString](/doc/utils/functions/streamToString.html)
- [stringToStream](/doc/utils/functions/stringToStream.html)
