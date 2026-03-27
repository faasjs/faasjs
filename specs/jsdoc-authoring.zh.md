# JSDoc 编写规范

英文: [JSDoc Authoring Specification](./jsdoc-authoring.md)

## 元信息

- 状态: 草案（Draft）
- 版本: v0.2
- 维护者: FaasJS Maintainers
- 适用范围: `packages/*/src` 下的公开导出，以及 `packages/*/{classes,functions,interfaces,type-aliases,variables}` 下生成的 API Markdown
- 最后更新: 2026-03-28

## 背景

FaasJS 目前已经主要通过 TypeScript 源码中的 JSDoc 来描述公开 API。[`build-docs.ts`](../build-docs.ts) 会对各 package 入口运行 TypeDoc，并在 `classes/`、`functions/`、`interfaces/`、`type-aliases/` 与 `variables/` 下生成 Markdown。

当前仓库已经形成了一些稳定模式：

- 在 `src/index.ts` 中提供 package 级概览
- 在导出声明附近提供符号摘要
- 使用 `@param`、`@returns`、`@example`、`@throws`、`@default`、`@property`、`@template`、`@see` 与 `{@link}` 等标签

同时，仓库里也存在标签写法、语言和重复注释上的漂移。本规范用于定义后续新增与修改公开 API 文档时应遵循的基线。

## 目标

- 让各 package 的公开 API 文档更可预测，并能稳定由 TypeDoc 生成。
- 让文档贴近源码，并与真实 TypeScript 行为保持一致。
- 让示例可直接复制，并方便用户与 AI coding agent 使用。

## 非目标

- 不替代 README 或教程型文档。
- 不要求为私有辅助函数或仅测试使用的代码补全文档。
- 不统一源码 JSDoc 与生成 API Markdown 之外的叙述性文档写法。

## 规范条款

### 1. 单一事实来源与适用范围

1. 公开 API 文档必须直接写在 `packages/*/src` 中对应导出声明旁边的 JSDoc 中。
2. `packages/*/{classes,functions,interfaces,type-aliases,variables}` 下的 Markdown 属于派生产物，必须视为生成结果，禁止手工修改。
3. 面向包使用者直接消费的导出 class、function、hook、React component、interface、type alias 与公开变量，应该都带有 JSDoc。
4. 重新导出的符号可以复用原始符号上的 JSDoc，但面向用户的 package 入口仍然应该提供 package 或 module 级概览。
5. 每个声明必须只有一个规范性的 JSDoc 块。同一声明前禁止存在重复的前导注释块。

### 2. 语言与文案

1. 公开 JSDoc 必须使用英文编写，以保证生成的 API Markdown 只有一种主语言。
2. 每个文档块的第一句话必须先概括该符号“是什么”或“做什么”。
3. 后续段落应该补充行为、约束、生命周期或重要注意事项，而不是重复 TypeScript 签名本身。
4. 文案必须描述可观察到的行为与契约，不应该重复容易漂移的实现细节。
5. 更新某个文档块时，即使附近仍有历史写法，被触达的注释也应该按本规范逐步归一。

### 3. 符号级内容要求

1. Function、hook 与 method 在类型签名不足以表达时，应该说明输入、返回值形态、副作用与失败场景。
2. Class 与 React component 若属于公开 API，应该提供顶层概览，以及构造函数或 props 的使用信息。
3. Interface 与对象形态的 type alias 应该说明用途，并应该通过成员 JSDoc 或 `@property` 描述重要字段。
4. 条件类型、推断类型、模板字符串类型或其他不直观的类型，应该解释映射规则；若能明显提升理解，也应该补充示例。
5. 当 package 预期被直接消费时，`src/index.ts` 中的 module 级注释应该包含安装与使用说明。

### 4. 标签约定

1. `@param` 在 TypeScript 源码中应该使用 `{Type} name - description` 风格。
2. 当返回值、Promise 载荷或空返回并非从摘要就能直接看出时，应该使用 `@returns`。
3. 对用法不够直观的公开 API，尤其是 class、hook、factory、配置对象与复杂类型，应该提供 `@example`。
4. 调用方需要感知并处理的异常或校验错误，必须通过 `@throws` 说明。
5. 存在明确运行时默认值的 option 或 props，应该使用 `@default`。
6. 对对象形态的 options、response props 或 prop bag，当内联成员注释不足时，应该使用 `@property`。
7. `@template`、`@see`、`@augments` 与 `@deprecated` 在能补充 TypeScript 语法无法直接表达的信息时可以使用。
8. 指向其他 FaasJS API 符号时，应该优先使用 `{@link Symbol}`。外部文档或 URL 可以使用普通 Markdown 链接。
9. 当同一个 JSDoc 块里出现多个块级标签时，应该遵循以下规范顺序：`@template`、`@param`、`@returns`、`@throws`、`@default`、`@property`、`@see`、`@augments`、`@deprecated`、`@example`。日常修改中被触达的公开文档，应该逐步收敛到从 `@template` 到 `@example` 的这一顺序。
10. 标签描述必须与真实运行时行为、默认值和错误语义保持一致。

### 5. 示例与引用

1. 示例必须使用带语言标识的围栏代码块，例如 `ts`、`tsx`、`sh` 或 `json`。
2. 示例应该尽量最小化、原则上可运行，并一次只聚焦一个行为。
3. 除非某个深层导入被明确作为公开 API 暴露，示例应该优先从 package 的公开入口导入。
4. 交叉引用应该指向最近的相关符号或外部参考，而不是在多处重复大段说明。
5. Package 或 class 的概览在能提升可读性时，可以使用简短的 Markdown 小标题与列表。

### 6. 生成与维护

1. 当公开 API 形状或公开 JSDoc 发生变化时，贡献者必须运行 `vp run doc`；若本地没有 `vp`，则使用 `npx vp run doc` 重新生成 API Markdown。
2. 生成结果应该经过检查，确认标题、参数说明、示例与链接都按预期渲染。
3. 历史注释中旧式标签顺序、混合语言或重复类型标注可以暂时保留，但被触达的公开文档应该逐步向本规范收敛。
4. 本规范只约束源码注释与生成的 API Markdown；文档站点页面与其他叙述性文档可以采用不同结构。

## 示例

````ts
/**
 * Load a package and resolve its preferred default export.
 *
 * @template T - The expected module shape.
 * @param {string} name - The package name to load.
 * @param {string | string[]} defaultNames - Preferred export keys used to resolve default values.
 * @param {LoadPackageOptions} options - Optional runtime loader options.
 * @returns Loaded module or resolved default export.
 * @throws {Error} When runtime cannot be determined.
 * @example
 * ```ts
 * const handler = await loadPackage('pkg', ['default', 'handler'])
 * ```
 */
export async function loadPackage<T = unknown>(
  name: string,
  defaultNames: string | string[] = 'default',
  options: LoadPackageOptions = {},
): Promise<T> {
  // ...
}
````

```ts
/**
 * Configuration options for a request.
 *
 * @property {Record<string, string>} [headers] - Extra request headers.
 * @property {boolean} [stream] - When true, return the native fetch response.
 */
export type Options = RequestInit & {
  /** @default false */
  stream?: boolean
}
```

## 兼容性

- 当前 FaasJS 各 package 已经依赖 JSDoc 加 TypeDoc 的方式生成公开 API Markdown。
- 历史注释里同时存在 `@param name {type}` 与 `@param name - description` 两种形式；两者目前都能渲染，但本规范优先推荐在 TypeScript 源码中使用 `{Type} name - description` 风格。
- 一些历史注释包含非英文描述；被触达的公开文档应逐步迁移为英文。

## 迁移检查清单

- [ ] 公开导出符号只有一个规范性的 JSDoc 块。
- [ ] 新增或修改的文档都以一句摘要开头。
- [ ] 运行时默认值、错误语义与不直观的用法示例都已记录。
- [ ] 多标签 JSDoc 块遵循从 `@template` 到 `@example` 的规范顺序。
- [ ] 能用 `{@link ...}` 的跨符号引用已尽量使用。
- [ ] 修改公开 API 文档后已运行 `vp run doc`。
