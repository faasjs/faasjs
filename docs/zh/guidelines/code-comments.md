# 代码注释指南

当你为 FaasJS 代码新增或评审 JSDoc、辅助注释或意图说明时，请使用这份指南。

## 适用场景

- 新增一个导出的 API
- 评审已有导出是否具备足够的文档说明
- 判断某个私有 helper 是否需要一条简短注释
- 保留 workaround、顺序敏感实现或其他日后看起来不直观的代码
- 清理已经开始重复代码本身的陈旧注释

## 默认工作流

1. 先把命名写清楚，不要让代码的基本可读性依赖注释。
2. 在实现收尾前，先给每个导出声明补上 JSDoc。
3. 让导出 JSDoc 至少覆盖功能概述、调用方输入和一个示例。
4. 只有当私有 helper 名称或非常规分支仍然不够清楚时，才补充简短行内注释。
5. 注释应解释这段代码为什么这样写，或它在保护什么约束，而不是逐行复述代码字面行为。
6. 一旦代码改动到旧注释可能漂移，就立即删除或重写注释。

## 规则

### 1. 所有导出都必须有 JSDoc

- 每个导出的 function、class、hook、React component、interface、type alias 和 public variable，都必须在声明附近拥有 JSDoc block。
- Re-export 可以复用原始声明上的规范性 JSDoc，但原始导出 symbol 本身仍然需要那份文档。
- 导出 JSDoc 是公开契约的一部分，因为它会进入生成的 API 文档，也会被下游 AI 或工具链消费。

### 2. 导出 JSDoc 必须覆盖功能、参数和示例

- 导出 JSDoc 必须先用简短概述告诉读者，这个 symbol 提供了什么功能、能力或职责。
- 如果功能概述无法清楚地压缩成一句话，就改用简短的 Markdown 列表，把功能点拆开列出，不要硬写成一段很密的说明。
- 可调用导出必须使用 `@param` 记录输入。
- 如果某个导出没有可调用参数，就用 `@property` 或成员级 JSDoc 记录面对使用者的输入字段，保证同样能看到参数层面的说明。
- 导出的 API 必须至少提供一个 `@example`，展示最小但真实的使用方式。
- 当返回值、异常、默认值或泛型参数会影响调用方理解时，再补充 `@returns`、`@throws`、`@default` 或 `@template`。

### 3. 内部函数只有在名称不够清楚时才写注释

- 遇到 `run`、`handle`、`format` 这类过于宽泛的 helper 名称时，先考虑改名，而不是先写注释。
- 当某个私有 helper 的名字仍不足以说明副作用、归一化规则、生命周期时机或缓存行为时，再在函数上方补一条简短注释。
- 对直白的控制流、数据映射或 TypeScript 样板代码，不要添加解释性注释。

### 4. 对非常规代码，注释重点写原因

- 当代码有意偏离直觉实现、依赖运行时顺序、绕过平台或工具限制，或是在防止某个隐蔽回归时，可以补一条简短说明。
- 注释应解释约束或原因，而不是解释语法。
- 一旦 workaround 或特殊分支消失，就把对应注释一并删掉。

### 5. 注释保持简洁且持续准确

- 优先控制在一两句话内。
- 不要重复 TypeScript 类型、变量名，或代码本身已经很清楚的逐行行为。
- 只要行为发生变化，就要在同一次改动中同步更新或删除相关注释。

## 示例

导出 API 示例：

````ts
/**
 * Build a normalized route matcher for a FaasJS pathname.
 *
 * This keeps trailing-slash handling consistent across dev and production routing.
 *
 * @param {string} pathname - Raw pathname from the incoming request.
 * @param {boolean} strict - When true, keep the trailing slash significant.
 * @returns Normalized matcher input for the router.
 * @example
 * ```ts
 * const matcher = createRouteMatcher('/users/', false)
 * ```
 */
export function createRouteMatcher(pathname: string, strict = false) {
  // ...
}
````

内部函数与非常规代码示例：

```ts
// Normalize ids once so repeated lookups do not allocate on every render.
function buildIdIndex(records: RecordItem[]) {
  // ...
}

// Keep this synchronous registration order because later plugins read earlier defaults.
plugins.unshift(systemPlugin)
```

## 评审清单

- 每个导出都有 JSDoc block
- 导出 JSDoc 覆盖了功能概述、调用方输入和示例
- 如果功能较复杂，一句话说不清，就改用简短列表拆开功能点
- 私有 helper 只有在命名仍不够清楚时才保留注释
- 非常规分支说明的是“为什么存在”
- 注释保持简短，并且与当前行为一致

## 延伸阅读

- [JSDoc 编写规范](../specs/jsdoc-authoring.md)
