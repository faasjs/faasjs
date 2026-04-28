# 代码注释指南

当你为 FaasJS 应用或 package 新增、评审 JSDoc、辅助注释或意图说明时，请使用这份指南。对于文档站点页面或教程类文档，请按页面自身最合适的结构来写，不必强行套用源码 JSDoc 的写法。

## 适用场景

- 新增一个导出的 API
- 评审已有导出是否具备足够的文档说明
- 判断某个私有 helper 是否需要一条简短注释
- 说明顺序敏感实现或其他日后看起来不直观的代码
- 清理已经开始重复代码本身的陈旧注释

## 默认工作流

1. 先把命名写清楚，不要让代码的基本可读性依赖注释。
2. 把公开 API 文档写成紧邻导出声明的 JSDoc，且每个导出只保留一份规范性的文档 block。
3. 公开 JSDoc 在同一个 package 内保持单一主语言；如果代码会跨团队共享或对外发布，优先使用英文；并在示例确实能帮助读者理解“调用后会发生什么”时，为运行时导出补上至少一个示例。
4. 使用稳定的 tag 语法、tag 顺序与链接写法，让生成文档、IDE 悬浮提示与评审 diff 保持可预测。
5. 把面向调用者的契约信息和面向维护者的实现说明分开写。
6. 只有当私有 helper 名称或非常规分支仍然不够清楚时，才补充简短行内注释。
7. 注释应解释这段代码为什么这样写，或它在保护什么约束，而不是逐行复述代码字面行为。
8. 如果项目会从 JSDoc 派生 API 文档，那么在契约变化后要从源码注释重新生成，并检查渲染结果。
9. 一旦代码改动到旧注释可能漂移，就立即删除或重写注释。

## 规则

### 1. 公开 API 文档应写在源码 JSDoc 中

- 公开 API 文档应作为紧邻导出声明的 JSDoc 写在源码里。
- 如果项目会从 JSDoc 生成参考文档，请把那些产物视为派生输出，并始终修改源码注释而不是直接修改生成结果。
- 每个导出的 function、class、hook、React component、interface、type alias 和 public variable，都必须在声明附近拥有 JSDoc block。
- Re-export 可以复用原始声明上的规范性 JSDoc，但原始导出 symbol 本身仍然需要那份文档。
- 每个声明都应只有一个规范性的 JSDoc block，不要为同一导出叠加重复的前置注释。
- 面向直接消费的 package 入口应提供 package 或模块概述；如果该 package 会被用户直接安装使用，还应顺手补充安装或直接使用说明。

### 2. 导出 JSDoc 必须讲清楚 symbol 的角色和调用契约

- 公开 JSDoc 在同一个 package 内应保持单一主语言；如果代码会跨团队共享或对外发布，优先使用英文。
- 第一段首句，或最前面的简短列表，必须让读者知道这个 symbol 提供了什么功能、能力或职责。
- 如果功能概述无法清楚地压缩成一句话，就改用简短的 Markdown 列表，或“短标题 + 列表”的结构，不要硬写成一段很密的说明。
- 可调用导出必须使用 `@param` 记录输入。
- 如果某个导出没有可调用参数，但确实暴露了面向使用者的字段，就用 `@property` 或成员级 JSDoc 记录这些字段，保证同样能看到参数层面的说明。
- 导出 JSDoc 应优先记录调用者真正关心的契约信息，例如可接受输入、返回结果、默认行为、可观察副作用，以及用户可感知的失败语义。
- 公开 surface 中的 class 和 React component，如果仅靠类型签名还不够清楚，就应补充顶层 overview，以及构造方式或 props 用法。
- conditional、inferred、template-literal 等不直观的类型 helper，应解释其映射规则；如果能明显提升理解，可以补充示例。
- 导出的运行时 API 应至少提供一个 `@example`，展示最小但真实的使用方式。
- 对于只描述结构的纯类型导出，例如 shape-only 的 interface 或 type alias，如果概述加上相关的 `@property` 或成员级 JSDoc 已经足够清楚，可以省略 `@example`；而没有字段的 union、primitive、template literal type 或 marker alias，只有概述也可以足够。
- 当返回值、异常、默认值或泛型参数会影响调用方理解时，再补充 `@returns`、`@throws`、`@default` 或 `@template`。

### 3. 使用稳定的 JSDoc tags 与引用方式

- 在 TypeScript 源码中，`@param` 应采用 `{Type} name - description` 风格。
- 当同一个 JSDoc block 中出现多个 block tags 时，优先使用这个顺序：`@template`、`@param`、`@returns`、`@throws`、`@default`、`@property`、`@see`、`@augments`、`@example`。
- 示例必须使用带有合适 info string 的 fenced code block，例如 `ts`、`tsx`、`sh` 或 `json`。
- 示例中的 import 应优先来自 package 的公开入口，除非某个 deep import 被明确视作公开 API。
- 指向同一代码库中的其他公开 API symbol 时，优先使用 `{@link Symbol}`；外部文档和 URL 则使用标准 Markdown links。
- `@see` 和 `@augments` 只有在能表达 TypeScript 语法本身无法表达的信息时才值得使用。
- 各 tag 的描述必须与真实运行时行为、默认值和错误语义保持一致。

### 4. 把调用契约和维护说明分开写

- 导出 JSDoc 主要写给调用者看，行内注释或 helper 上方的短注释主要写给维护实现的人看。
- `@param`、`@returns`、`@property`、默认值和失败语义这类契约信息，应集中放在导出 JSDoc 中，不要散落在实现内部。
- 实现侧注释应聚焦在原因、顺序、隐藏约束和权衡，而不是重复调用者已经知道的信息。
- 对于公开但通常不建议直接调用的低层 API，应顺手注明更常见、更推荐的上层 helper 或入口。

### 5. 写示例时，要让读者看懂这个 symbol 在流程里的角色

- 每个 `@example` 都应帮助读者回答：“这个值从哪里来？”或“我用这个 API 之后会有什么变化？”
- 当某个 symbol 的作用依赖上下文时，例如 provider/consumer、hook/context、回调注册或请求/响应链路，优先给出一个很小但完整的端到端场景，不要只写脱离上下文的一行代码。
- 示例应尽量最小化、理论上可运行，并且一次只聚焦一个行为。
- 对低层 API，如果日常更推荐使用上层 helper，就在示例里把外围 setup 展示出来，并顺手点明更常见的调用入口。
- 同一个模块下彼此关联的导出，尽量复用同一套业务场景，这样读者更容易看懂它们之间的关系。
- 避免 `const value = thing`、`{} as Type` 这类只占位、不增加理解的信息型示例。
- 示例可以很短，但结果必须可观察，比如返回数据、渲染出的文案，或其他具体效果。

### 6. 优先记录边界条件、失败语义和隐藏前提

- 比起重复 happy path，更应该优先解释 `null`、`undefined`、空集合、默认值，以及顺序敏感这类边界情况。
- 当失败行为会影响正确使用时，要明确说明：是抛错、返回 fallback、跳过处理、重试，还是静默 no-op。
- 对代码本身不容易一眼看出的前提条件，要写清楚，例如必须在某个 provider 内调用、必须先注入某个 plugin，或只能运行在特定环境。
- 如果行为依赖时序或生命周期，要直接点明阶段或顺序要求，例如先 mount 再 invoke、先合并 defaults 再应用 overrides，或先注册再读取。

### 7. 内部函数只有在名称不够清楚时才写注释

- 遇到 `run`、`handle`、`format` 这类过于宽泛的 helper 名称时，先考虑改名，而不是先写注释。
- 当某个私有 helper 的名字仍不足以说明副作用、归一化规则、生命周期时机或缓存行为时，再在函数上方补一条简短注释。
- 对直白的控制流、数据映射或 TypeScript 样板代码，不要添加解释性注释。

### 8. 对非常规、性能敏感或受平台/工具约束的代码，重点写原因

- 当代码有意偏离直觉实现、依赖运行时顺序、绕过平台或工具限制，或是在防止某个隐蔽回归时，可以补一条简短说明。
- 对性能相关注释，要说明触发条件以及在避免什么代价，而不是只写“为了性能”。
- 注释应解释约束或原因，而不是解释语法。

### 9. 公开 JSDoc 变化后要同步派生文档

- 当公开 API 契约或公开 JSDoc 发生变化时，任何派生文档都应从源码注释同步，而不是直接修补复制出来的输出。
- 检查生成或发布后的结果，确认标题、参数描述、示例与链接都能正确渲染。
- 修正应先落在源码 JSDoc 上，再重新生成，不要直接改复制出来的输出。

### 10. 注释保持简洁、稳定且持续准确

- 每一段解释性说明或每条行内注释，优先控制在一两句话内。
- 不要重复 TypeScript 类型、变量名，或代码本身已经很清楚的逐行行为。
- 优先写目的、约束和契约这类更稳定的信息，不要把注释写成对当前实现细节的脆弱镜像。
- 术语尽量与公开 API 保持一致，避免源码注释、生成文档和对外文案各说各话。
- 只要你改动了某个公开 JSDoc block，就顺手把它规范到这份指南里，即使周围还有旧风格注释也一样。
- 只要行为发生变化，就要在同一次改动中同步更新或删除相关注释。

## 示例

运行时导出 API 示例：

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

tag 顺序与交叉引用示例：

````ts
/**
 * Load a package and return its default export.
 *
 * @template T - Expected module shape.
 * @param {string} name - Package name to load.
 * @returns Loaded default export.
 * @throws {Error} When runtime cannot be determined.
 * @see {@link loadConfig}
 * @example
 * ```ts
 * const handler = await loadPackage('pkg')
 * ```
 */
export async function loadPackage<T = unknown>(name: string): Promise<T> {
  // ...
}
````

低层公开 API 示例：

````ts
/**
 * 为单次调用创建一个带请求上下文的 logger。
 *
 * 大多数业务代码都应该在 handler 内调用 `useLogger()`。
 * 只有在服务启动阶段手动组装 request context 时，才需要直接调用它。
 *
 * @param {LoggerTransport} transport - 应用启动时创建好的共享 transport。
 * @param {RequestLike} request - 当前调用对应的请求元数据。
 * @returns 已预填 request id 和 pathname 的 logger。
 * @see {@link useLogger}
 * @example
 * ```ts
 * const transport = createConsoleTransport()
 * const requestLogger = createRequestLogger(transport, {
 *   requestId: 'req_123',
 *   pathname: '/orders'
 * })
 *
 * requestLogger.info('fetch order list')
 * ```
 */
export function createRequestLogger(transport: LoggerTransport, request: RequestLike) {
  // ...
}
````

内部、性能与平台/工具约束注释示例：

```ts
// Normalize ids once so repeated lookups do not allocate on every render.
function buildIdIndex(records: RecordItem[]) {
  // ...
}

// Keep this synchronous registration order because later plugins read earlier defaults.
plugins.unshift(systemPlugin)
```

## 评审清单

- 公开 API 文档都写在源码 JSDoc 中，任何派生参考文档都从源码同步，而不是被手工修改
- 每个导出只有一个规范性的 JSDoc block
- 公开 JSDoc 在同一个 package 内保持单一主语言，package 入口在需要时提供模块概述
- 导出 JSDoc 覆盖了功能概述、调用方输入，以及在导出面向运行时或示例确实能增加理解时提供示例
- classes、components 与不直观的类型 helper 都补充了调用者真正需要的额外上下文
- tag 语法、tag 顺序和交叉引用遵循统一约定
- 示例解释的是 API 在流程中的作用，并且能让读者看到具体的因果关系
- 低层 API 的示例提供了足够的上下文，让读者能看懂调用链路
- 会影响正确使用的边界条件、失败语义和隐藏前提都已写明
- 性能和平台/工具约束注释说明了具体在保护什么约束
- 公开 JSDoc 变化后，相关派生文档已同步，并快速检查了渲染结果
- 私有 helper 只有在命名仍不够清楚时才保留注释
- 非常规分支说明的是“为什么存在”
- 注释保持简短，并且与当前行为一致
