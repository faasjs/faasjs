# Utils 指南

当你在应用代码、测试或运行时 adapter 中需要来自 `@faasjs/utils` 的轻量 helpers 时，请使用这份指南。

## 适用场景

- 用用户覆盖项与默认值合并配置
- 把文本或 JSON 转成 `ReadableStream`
- 把 stream body 再读回文本或数据
- 希望 helper 代码能在 Node.js、浏览器和 edge runtime 间保持可移植

## `@faasjs/utils` 提供什么

- `deepMerge`：递归合并嵌套对象与数组，且不修改输入值
- `stringToStream`：把纯文本转成 UTF-8 `ReadableStream`
- `streamToString`：把文本 stream 读取回字符串
- `objectToStream`：把 JSON 数据序列化成 stream
- `streamToObject`：把 JSON 数据从 stream 解析回来

## 常见模式

### 1. 用 overrides 合并默认配置

- 当你想把默认值、环境值和单次请求覆盖项合成一个最终配置对象时，使用 `deepMerge`。
- 后面的值优先。嵌套对象递归合并。数组会去重，并且较新的项排在前面。

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

### 2. 从文本或 JSON 构造 stream body

- 原始文本使用 `stringToStream`。
- JSON 使用 `objectToStream`，这样就不需要自己调用 `JSON.stringify()`。

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

### 3. 把 stream body 读回可用数据

- 文本载荷使用 `streamToString`。
- JSON 载荷使用 `streamToObject`。

```ts
import { objectToStream, streamToObject, streamToString, stringToStream } from '@faasjs/utils'

const text = await streamToString(stringToStream('hello'))
const result = await streamToObject<{ ok: boolean }>(objectToStream({ ok: true }))

console.log(text) // 'hello'
console.log(result.ok) // true
```

### 4. 选择成对出现的 helper

- `stringToStream` 对应 `streamToString`
- `objectToStream` 对应 `streamToObject`
- 结构化数据优先使用 JSON 这一对，原始 body 内容优先使用文本这一对

## 评审清单

- 只有在确实需要递归合并时才使用 `deepMerge`
- 文本载荷使用文本 stream helpers
- JSON 载荷使用对象 stream helpers
- 示例与测试选择的是最小且最能表达意图的 helper

## 延伸阅读

- [@faasjs/utils package reference](/doc/utils/)
- [deepMerge](/doc/utils/functions/deepMerge.html)
- [objectToStream](/doc/utils/functions/objectToStream.html)
- [streamToObject](/doc/utils/functions/streamToObject.html)
- [streamToString](/doc/utils/functions/streamToString.html)
- [stringToStream](/doc/utils/functions/stringToStream.html)
