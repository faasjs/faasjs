# Utils 指南

当你在应用代码、测试或运行时适配器中需要使用 `@faasjs/utils` 的轻量级辅助函数时，请参考本指南。

## 适用场景

- 递归合并配置对象
- 将文本与流之间相互转换
- 编写可在 Node.js、浏览器和边缘运行时中跨平台运行的便携辅助代码

## `@faasjs/utils` 提供的能力

- `deepMerge`：合并嵌套对象和数组而不修改输入
- `stringToStream`：将纯文本转换为 UTF-8 `ReadableStream`
- `streamToString`：将文本流读取回字符串
- `objectToStream`：将 JSON 数据序列化为流（详见 [JSON 指南](./json.md)）
- `streamToObject`：从流中解析 JSON 数据（详见 [JSON 指南](./json.md)）
- `z`：扩展的 Zod 实例，提供便捷辅助方法（详见 [校验指南](./valid.md)）
- `isObjectRecord`：检查值是否为纯对象的类型守卫（详见 [校验指南](./valid.md)）
- `parseJson`：安全地解析 JSON 字符串并推断类型（详见 [JSON 指南](./json.md)）
- `parseObjectFromJson`：将现有对象或 JSON 字符串规范化为对象记录（详见 [JSON 指南](./json.md)）
- `parseArrayFromJson`：将现有数组或 JSON 字符串规范化为数组（详见 [JSON 指南](./json.md)）
- `parseYaml`：解析 FaasJS 支持的 YAML 子集（详见 [YAML 指南](./yaml.md)）

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

### 2. 从文本构建流主体

- 对原始文本使用 `stringToStream`。
- 对于 JSON 负载，使用 `objectToStream`（详见 [JSON 指南](./json.md)）。

```ts
import { stringToStream } from '@faasjs/utils'

const textBody = stringToStream('hello from FaasJS')
```

### 3. 将流主体读取回文本

- 对文本负载使用 `streamToString`。
- 对于 JSON 负载，使用 `streamToObject`（详见 [JSON 指南](./json.md)）。

```ts
import { streamToString, stringToStream } from '@faasjs/utils'

const text = await streamToString(stringToStream('hello'))
console.log(text) // 'hello'
```

### 4. 选择匹配的辅助函数对

- `stringToStream` 与 `streamToString` 配对使用（文本内容）
- `objectToStream` 与 `streamToObject` 配对使用（JSON 内容，详见 [JSON 指南](./json.md)）

### 5. 安全地解析 JSON

详见 [JSON 指南](./json.md) 了解 `parseJson`、`parseObjectFromJson` 和 `parseArrayFromJson` 的用法。

### 6. 使用 Zod 模式验证数据

详见 [校验指南](./valid.md) 了解 `z` 和 `isObjectRecord` 的用法。

## 审查清单

- 仅在实际需要递归合并时才使用 `deepMerge`
- 文本负载使用 `stringToStream` / `streamToString`
- JSON 负载使用 [JSON 指南](./json.md) 中的辅助函数
- 数据验证使用 [校验指南](./valid.md) 中的辅助函数
- 示例和测试选择最小的辅助函数，保持意图清晰

## 延伸阅读

- [@faasjs/utils 包参考](/doc/utils/)
- [deepMerge](/doc/utils/functions/deepMerge.html)
- [streamToString](/doc/utils/functions/streamToString.html)
- [stringToStream](/doc/utils/functions/stringToStream.html)
- [JSON 指南](./json.md)
- [校验指南](./valid.md)
