# JSDoc 编写规范

## 背景

FaasJS 已经主要通过 TypeScript 源码中的 JSDoc 来生成公开 API 文档。[`build-docs.ts`](https://github.com/faasjs/faasjs/blob/main/build-docs.ts) 会对各 package 入口运行 TypeDoc，并在 `classes/`、`functions/`、`interfaces/`、`type-aliases/` 和 `variables/` 下输出 Markdown。

当前 package 文档已经呈现出一些稳定模式：

- `src/index.ts` 中的 package overview
- 紧贴导出声明的 symbol summary
- `@param`、`@returns`、`@example`、`@throws`、`@default`、`@property`、`@template`、`@see` 和 `{@link}` 等标签

同时，仓库中仍然存在 tag 语法、语言和内容重复上的风格漂移。这份规范定义了未来新增或被修改的公开 API 文档编写基线。

## 目标

- 让各 package 的公开 API 文档保持可预测，并且易于通过 TypeDoc 生成。
- 让文档始终贴近源码，并与真实 TypeScript 行为保持一致。
- 让示例对用户和 AI 编码 agent 都具备可复制性。

## 非目标

- 替代 README 或教程类文档。
- 记录私有 helpers 或仅供测试使用的 API。
- 统一源码 JSDoc 与生成 API Markdown 之外的散文风格。

## 规范性规则

### 1. 单一事实来源与作用域

1. 公开 API 文档必须以 JSDoc 的形式写在 `packages/*/src` 中，且紧邻导出声明。
2. `packages/*/{classes,functions,interfaces,type-aliases,variables}` 下的生成 Markdown 必须被视为派生产物，禁止手工编辑。
3. 只要某个导出 class、function、hook、React component、interface、type alias 或 public variable 是面向 package 用户直接消费的，就应有对应的 JSDoc block。
4. Re-export 可以复用原 symbol 的 JSDoc，但若 package 对用户可见，其 entrypoint 仍应提供 package 或 module overview。
5. 每个声明必须只有一个规范性的 JSDoc block，不允许为同一声明写重复的前置注释。

### 2. 语言与文案

1. 公开 JSDoc 必须使用英文书写，这样生成的 API Markdown 才能保持单一主语言。
2. 第一段首句必须概括说明该 symbol 是什么或做什么。
3. 额外段落应解释行为、约束、生命周期或重要 caveats，而不是简单重复 TypeScript 签名。
4. 文案必须描述可观察行为与契约，不应重复容易漂移的实现细节。
5. 当某个 doc block 被更新时，即使周围仍然存在旧风格注释，也应把该 block 规范化到本规范。

### 3. Symbol 级内容

1. 对 functions、hooks 和 methods，当输入、返回值、side effects 或 failure cases 不能仅从类型签名中一眼看出时，应明确记录。
2. 对 classes 和 React components，若它们属于公开 surface，应提供顶层 overview，并在需要时说明构造方式或 props 用法。
3. 对 interfaces 和对象形态的 type aliases，应描述其用途，并通过成员 JSDoc 或 `@property` 记录重要字段。
4. 对 conditional、inferred、template-literal 等不直观的类型，应说明其映射规则；如果能提升理解，应附示例。
5. 对面向直接消费的 package，`src/index.ts` 中的 package-level module comments 应包含安装与使用说明。

### 4. 标签约定

1. 在 TypeScript 源码中，`@param` 应采用 `{Type} name - description` 风格。
2. 当 summary 不能清楚说明返回值、Promise 载荷或空返回时，应使用 `@returns`。
3. 对用法不直观的公开 API，尤其是 classes、hooks、factories、configuration objects 和高级类型，应提供 `@example`。
4. 对调用方预期需要处理的用户可观察异常或校验错误，必须使用 `@throws` 记录。
5. 对有重要运行时默认值的 options 或 props，应使用 `@default`。
6. 对对象形态的 options、response props 或 props bags，当行内成员注释不够时，应使用 `@property`。
7. 当 `@template`、`@see`、`@augments` 和 `@deprecated` 能表达 TypeScript 语法本身无法表达的信息时，可以使用。
8. 关联其他 FaasJS API symbols 时，应优先使用 `{@link Symbol}`；外部文档和 URL 可以使用标准 Markdown links。
9. 当同一个 JSDoc block 中存在多个 block tags 时，应遵循这个顺序：`@template`、`@param`、`@returns`、`@throws`、`@default`、`@property`、`@see`、`@augments`、`@deprecated`、`@example`。被正常修改过的公开文档应逐步向这个顺序靠拢。
10. 各 tag 的描述必须与真实运行时行为、默认值和错误语义保持一致。

### 5. 示例与引用

1. 示例必须使用带有合适 info string 的 fenced code block，例如 `ts`、`tsx`、`sh` 或 `json`。
2. 示例应尽量最小化、理论上可运行，并且一次只聚焦一个行为。
3. 示例应从 package 的公开入口导入，除非某个 deep import 被明确视作公开 API。
4. 交叉引用应指向最接近的相关 symbol 或外部参考，而不是在多个地方重复长篇说明。
5. 当有助于提升可扫描性时，package 与 class overview 可以使用简短的 Markdown heading 与 bullet list。

### 6. 生成与维护

1. 当导出的 API 结构或公开 JSDoc 发生变化时，贡献者必须运行 `vp run doc`；若本地没有 `vp`，则运行 `npx vp run doc` 重新生成 API Markdown。
2. 应检查生成结果，确认标题、参数描述、示例与 links 都能正确渲染。
3. 旧注释即便暂时仍保留旧 tag 顺序、混合语言或重复类型信息，但只要文档被修改过，就应朝着本规范靠拢。
4. 本规范只约束源码注释与生成 API Markdown。docs site 页面与其他叙述性文档可以采用不同结构。

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
