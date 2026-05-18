# 代码注释指南

用于 FaasJS 应用或包中的源码 JSDoc、辅助注释和简短意图说明。文档页面和教程可使用页面特定的结构。

## 适用场景

- 添加新的包公共导出
- 审查现有导出的文档是否完整
- 决定私有辅助函数是否需要注释
- 解释顺序敏感或不直观的代码
- 在代码变更时清理过时的注释

## 默认工作流

1. 首先选择清晰的命名；不要用注释弥补模糊的代码。
2. 对导出进行分类：包公共 API、共享应用边界或功能级实现。
3. 使用相邻的 JSDoc 记录包公共 API，每个导出一个规范的代码块。
4. 仅当调用方契约、副作用或失败行为无法从名称和类型中明显看出时，才添加共享应用 JSDoc。
5. 对于功能级组件、hooks、API 默认导出和测试辅助函数，除非能防止真正的歧义，否则跳过常规 JSDoc。
6. 公共 JSDoc 在每个包中使用一种主要语言；公开发布或跨团队的包优先使用英文。
7. 仅为不明显的私有辅助函数、排序约束或性能敏感的代码分支添加内联注释。
8. 解释用途、调用方契约或约束；不要叙述语法或逐行流程。
9. 公共契约变更后，从源码 JSDoc 重新生成衍生的 API 文档。
10. 在改变行为的同时删除或重写过时的注释。

## 规则

### 1. 导出表面

- 包公共函数、类、hooks、React 组件、接口、类型别名和公共变量必须有相邻的 JSDoc。
- 将生成的 API 文档视为衍生制品；始终编辑源码注释而非生成的输出。
- 共享应用导出在构成可复用边界或暴露不明显的调用方预期时，应有 JSDoc。
- 功能级导出如果只是为了本地组合、路由或测试而导出且其契约显而易见，可以省略 JSDoc。
- 重新导出可以复用原始声明的规范 JSDoc，但原始公共符号仍需要文档块。
- 公共包入口点在直接使用时应有包或模块概述。
- 对于直接使用的包，在模块概述中包含安装说明。

### 2. JSDoc 内容

- 从描述该符号提供什么的一句话开始。
- 枚举字段或行为时使用简短列表而非密集段落。
- 优先提供调用方关心的细节：接受的输入、返回的输出、默认值、可观察的副作用和用户可见的失败行为。
- 对于具有有意义字段的不可调用导出，使用 `@property` 记录每个字段。
- 可调用的包公共导出必须使用 `@param` 记录输入；当对调用方有用时添加 `@returns`、`@throws`、`@default` 或 `@template`。
- 不明显的条件、推断、模板字面量或标记类型辅助函数应解释映射规则。
- 运行时公共 API 在能阐明调用方行为时应有最小化的 `@example`。对于纯类型或纯形状的导出，如果概述和成员文档足够，可以省略示例。
- 对于类和组件，添加顶级概述，描述组件的角色、其所需的上下文和关键渲染行为。

### 3. 风格和标签

- 在 TypeScript 源码中优先使用 `@param {Type} name - description` 风格。
- 多个标签出现时，优先顺序：`@template`、`@param`、`@returns`、`@throws`、`@default`、`@property`、`@see`、`@augments`、`@example`。
- 仅当信息无法通过 TypeScript 语法表达时，才使用 `@see` 和 `@augments`。
- 使用带有 `ts`、`tsx`、`sh` 或 `json` 代码围栏的示例。
- 示例导入应来自包公共入口点，除非深度导入是故意公开的。
- 对同代码库的公共符号使用 `{@link Symbol}`，对外部文档使用 Markdown 链接。
- 保持描述与实际运行时行为、默认值和错误语义一致。

### 4. 区分调用方契约与维护注释

- 为调用方编写导出的 JSDoc；为维护者编写内联注释。
- 契约信息（`@param`、`@returns`、`@property`、默认值、失败语义）属于导出的 JSDoc 块，不应分散在实现细节中。
- 实现侧的注释应关注推理、排序、隐藏约束和权衡。
- 对于非直接使用的底层 API，注明推荐的高层辅助函数或入口点。

### 5. 编写展示符号在流程中角色的示例

- 每个示例应回答"这个值从哪来？"或"调用这个后会发生什么？"
- 当符号依赖于上下文（provider/consumer、hook/context、回调注册）时，优先选择最小但完整的端到端场景。
- 保持示例最小化、理论上可运行，并一次只聚焦一个行为。
- 对于底层 API，展示周围的设置并指向更常见的入口点。
- 同一模块下的相关导出应尽可能复用相同的业务场景。
- 避免使用 `const value = thing` 或 `{} as Type` 之类的占位符示例。
- 示例可以简短，但结果必须是可观察的。

### 6. 优先关注边界条件、失败语义和隐藏假设

- 优先记录 `null`、`undefined`、空集合、默认值和顺序敏感情况，而非正常路径行为。
- 明确说明失败行为：抛出、返回回退值、跳过、重试或静默无操作。
- 记录代码中不明显的假设：在特定 provider 内调用、必须先注册插件、仅在特定环境下可用。
- 如果行为依赖于时序或生命周期，直接说明阶段或顺序要求。

### 7. 内联注释

- 私有辅助函数仅在好的命名仍无法解释业务规则、排序约束或非标准分支时才需要注释。
- 解释代码存在的原因、它保护的不变性或它处理的平台/工具限制。
- 对于性能注释，说明触发的条件和避免的开销。
- 避免重复类型、变量名、明显的控制流或 TypeScript 样板代码。
- 当遇到过于通用的名称（`run`、`handle`、`format`）时，优先重命名而非添加注释。

### 8. 解释不寻常、性能敏感或受平台限制的代码

- 当代码有意偏离直观实现、依赖于运行时排序、绕过平台/工具限制或防止微妙的回归时，添加简短的解释。
- 与性能相关的注释应说明触发条件和避免的开销，而不仅仅是"为了性能"。
- 注释应解释约束或推理，而非语法。

### 9. 从源码重新生成衍生文档

- 公共契约变更后，从源码 JSDoc 重新生成 API 文档。
- 检查生成的输出是否正确渲染。
- 修复应先落地到源码 JSDoc，然后再重新生成。

### 10. 保持注释简洁、稳定且持续准确

- 每条注释应为 1-2 句话。
- 不要重复 TypeScript 类型、变量名或代码已经明确的内容。
- 优先使用稳定的信息（用途、约束、契约）而非易变的实现细节。
- 保持术语与公共 API 命名一致。
- 修改公共 JSDoc 块时，使其符合本指南的约定。
- 行为变更时，在同一变更中更新或删除注释。

## 示例

带有完整标签排序的运行时 API JSDoc：

````ts
/**
 * Build a normalized route matcher for a FaasJS pathname.
 *
 * @param {string} pathname - Raw pathname from the incoming request.
 * @param {boolean} strict - When true, keep the trailing slash significant.
 * @returns Normalized matcher input for the router.
 * @example
 * ```ts
 * const matcher = createRouteMatcher('/users/', false)
 * ```
 */
export function createRouteMatcher(pathname: string, strict = false) {}
````

带有模板和 throws 的泛型函数：

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
 * const handler = await loadPackage<MyHandler>('pkg')
 * ```
 */
export async function loadPackage<T = unknown>(name: string): Promise<T> {
  // ...
}
````

带有使用指导的底层公共 API：

````ts
/**
 * Create a request-contextualized logger for a single invocation.
 *
 * Most business code should call `useLogger()` inside a handler.
 * Only call this directly when manually assembling a request context
 * during service startup.
 *
 * @param {LoggerTransport} transport - Shared transport created at app startup.
 * @param {RequestLike} request - Request metadata for the current call.
 * @returns Logger pre-filled with request id and pathname.
 * @see {@link useLogger}
 * @example
 * ```ts
 * const transport = createConsoleTransport()
 * const requestLogger = createRequestLogger(transport, {
 *   requestId: 'req_123',
 *   pathname: '/orders'
 * })
 * requestLogger.info('fetch order list')
 * ```
 */
export function createRequestLogger(transport: LoggerTransport, request: RequestLike) {
  // ...
}
````

约束注释：

```ts
// Normalize ids once so repeated lookups do not allocate on every render.
function buildIdIndex(records: RecordItem[]) {}

// Keep this synchronous registration order because later plugins read earlier defaults.
plugins.unshift(systemPlugin)
```

## 审查检查清单

- 包公共导出有一个规范的 JSDoc 块
- 共享应用导出仅在调用方契约不明显时才有文档
- 功能级导出避免冗长的常规 JSDoc
- 公共 API 文档位于源码 JSDoc 中；衍生文档从源码同步
- 公共 JSDoc 在每个包中使用一种主要语言，并在入口点包含模块概述
- 类、组件和不明显的类型辅助函数包含调用方所需的上下文
- JSDoc 在相关时覆盖角色、输入、输出、默认值、副作用和失败
- 示例解释 API 在流程中的角色，并展示具体的因果关系
- 底层 API 示例提供足够的上下文以理解调用链
- 记录影响正确性的边界条件、失败语义和隐藏假设
- 性能和平台/工具约束注释解释它们保护的不变性
- 标签语法、排序、链接和示例遵循约定
- 内联注释解释约束或原因，而非语法
- 公共契约变更后从源码注释重新生成衍生文档
- 注释简短、当前且不重复
