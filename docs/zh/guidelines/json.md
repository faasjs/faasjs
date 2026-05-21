# JSON 指南

当你在 FaasJS 项目中需要使用 `@faasjs/utils` 的 JSON 辅助函数来解析、序列化或规范化 JSON 数据时，请参考本指南。

## 适用场景

- 安全地解析 JSON 字符串并推断类型
- 将未知输入规范化为类型化的对象或数组
- 将 JSON 数据与流之间相互转换
- 构建结构化的请求或响应主体

## `@faasjs/utils` 提供的 JSON 能力

- `parseJson` — 安全地解析 JSON 字符串并推断类型
- `parseObjectFromJson` — 将现有对象或 JSON 字符串规范化为对象记录
- `parseArrayFromJson` — 将现有数组或 JSON 字符串规范化为数组
- `objectToStream` — 将 JSON 数据序列化为 `ReadableStream`
- `streamToObject` — 从流中解析 JSON 数据

## 常见模式

### 1. 安全地解析 JSON

当你有 JSON 字符串并希望获得类型化结果时，使用 `parseJson`。当输入可能是对象或 JSON 字符串时，使用 `parseObjectFromJson` — 将两者统一规范化为类型化记录。当输入可能是数组或 JSON 字符串时，使用 `parseArrayFromJson` — 将两者统一规范化为类型化数组。

这三个函数在输入无效时都会抛出异常，因此在不可信边界请使用 try/catch 包裹。

```ts
import { parseJson, parseObjectFromJson, parseArrayFromJson } from '@faasjs/utils'

const data = parseJson<{ id: number }>('{"id": 1}')
// data.id === 1

const obj = parseObjectFromJson<{ name: string }>(event.body)
// 同时接受 { name: "alice" } 和 '{"name": "alice"}'

const arr = parseArrayFromJson<string[]>(rawItems)
// 同时接受 ["a", "b"] 和 '["a", "b"]'
```

### 2. 构建 JSON 流主体

使用 `objectToStream` 处理 JSON 负载，这样你就不需要自己调用 `JSON.stringify()`。

```ts
import { objectToStream } from '@faasjs/utils'

const jsonBody = objectToStream({
  ok: true,
  user: {
    id: 1,
    name: 'admin',
  },
})
```

### 3. 将流主体读取回 JSON 数据

对 JSON 负载使用 `streamToObject`。

```ts
import { objectToStream, streamToObject } from '@faasjs/utils'

const result = await streamToObject<{ ok: boolean }>(objectToStream({ ok: true }))
console.log(result.ok) // true
```

### 4. 选择匹配的辅助函数对

- `objectToStream` 与 `streamToObject` 配对使用
- 结构化数据优先使用 JSON 对
- 原始文本负载使用 `@faasjs/utils` 的 `stringToStream` / `streamToString`（详见 [Utils 指南](./utils.md)）

## 审查清单

- JSON 解析使用 `parseJson` / `parseObjectFromJson` / `parseArrayFromJson` 而非原始 `JSON.parse`
- 输入规范化优先使用 `parseObjectFromJson` 或 `parseArrayFromJson`，而非类型断言
- JSON 负载使用 `objectToStream` / `streamToObject`，而非手动 `JSON.stringify` / `JSON.parse`
- 示例和测试选择最小的辅助函数，保持意图清晰

## 延伸阅读

- [@faasjs/utils 包参考](/doc/utils/)
- [parseJson](/doc/utils/functions/parseJson.html)
- [parseObjectFromJson](/doc/utils/functions/parseObjectFromJson.html)
- [parseArrayFromJson](/doc/utils/functions/parseArrayFromJson.html)
- [objectToStream](/doc/utils/functions/objectToStream.html)
- [streamToObject](/doc/utils/functions/streamToObject.html)
- [Utils 指南](./utils.md)
