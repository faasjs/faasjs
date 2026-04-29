# 测试指南

当你在 FaasJS 项目中编写或评审测试时，请先使用这份通用指南。

## 适用场景

- 为 API、utils、hooks、组件或运行时 helpers 编写或评审测试
- 决定某个依赖应该保留真实实现，还是替换成 mock
- 为当前场景选择最小但有效的测试层级
- 检查测试保护的是行为，而不是实现细节

## 默认工作流

1. 先明确测试要捕获的公开行为或回归风险。
2. 选择仍然能够覆盖真实边界的最小测试层级。
3. 除非清晰的边界确实需要隔离，否则保持本地业务逻辑、helpers、hooks 与组件为真实实现。
4. 只 mock 外部、非确定性、成本高或其他难以控制的边界。
5. 让 mock 设置保持显式、贴近场景，并且比它替代的真实行为更小、更简单。
6. 覆盖 success path，以及调用方真正依赖的失败路径或状态变化。
7. 在 case 之间重置共享的全局状态、timers、env 与 mocks。
8. 将每个测试文件放在它保护的 feature、API、hook、组件、helper 或 job 附近。
9. 交付前将 `vp check --fix` 和 `vp test` 作为验收门禁执行；如果当前环境无法运行其中任一命令，记录阻塞原因以及已经完成的更小范围验证。

## 规则

### 1. 测公开行为，不测实现细节

- 断言返回数据、渲染输出、抛出的错误、写入的响应字段，或其他对外可见的效果。
- 除非那本身就是契约，否则不要断言内部调用顺序、私有 helper 的使用、中间状态结构或框架内部细节。
- 只要行为保持不变，正常重构通常不应要求重写测试。

### 2. 在被测边界内部优先保留真实依赖

- 只要场景能通过公开输入到达，就让本地函数、hooks、子组件、schemas 与 helpers 保持真实实现。
- 这样可以更早暴露依赖问题与集成回归，而不是被 test doubles 隐藏。
- 不要只是为了让测试更短就去 mock，那样往往会把生产环境里最容易出错的部分一起拿掉。

### 3. 只 mock 必须隔离的最窄边界

- 合适的 mock 边界通常是网络请求、数据库访问、时钟、随机值、文件系统、process env 或第三方服务。
- 如果一个更低层级的测试必须依赖大量内部 mocks 才能成立，应该改成更高层级的测试。
- 必须 mock 时，要让契约保持显式，并让 fake 行为小于真实生产行为。

### 4. 选择最小但足够建立信心的测试层级

- 纯逻辑使用 pure 或 unit tests。
- endpoint 契约、参数校验与 HTTP 行为使用 handler 或 API tests。
- UI 行为使用 component 或 hook tests。
- 优先选择既能覆盖真实集成、又不需要大面积内部 mocks 的层级。

### 5. 覆盖用户和调用方真正依赖的路径

- success path
- 有意义的校验或错误路径
- 真实生产环境里可能失败的边界故障
- 功能支持时的 reload、retry 或状态迁移行为
- 涉及共享状态时的 cleanup 或 reset 行为

### 6. 测试要靠近它保护的项目区域

- 不要把所有 package 测试文件集中放进兜底的 `src/__tests__` 目录，也不要在这个集中目录下再按 feature 建子目录。
- 按项目用途、feature 或 slice 拆分代码和测试，让 API、UI、job、helper 与集成测试都留在拥有该行为的 feature 文件夹下。
- 测试文件放在所属文件夹自己的 `__tests__` 下，例如 `src/pages/users/api/__tests__/list.test.ts` 对应 `list.api.ts`，或 `src/jobs/users/__tests__/cleanup.test.ts` 对应 `cleanup.job.ts`。
- 当被保护的业务代码原本只是单文件时，先改成包含 `index.ts` 或 `index.tsx` 的文件夹，并把测试放在该文件夹的 `__tests__` 下，例如 `src/useBilling/index.ts` 和 `src/useBilling/__tests__/useBilling.test.ts`。

## 评审清单

- 测试断言的是公开行为
- 本地依赖保持真实，除非清晰边界确实需要隔离
- mocks 显式存在，并且只放在狭窄的外部边界
- mock 行为比它替代的真实行为更简单
- 选择的测试层级与风险匹配，并避免不必要的内部 mocking
- 覆盖了 success path 和有意义的失败路径
- case 之间会重置共享状态、timers、env 与 globals
- 测试文件放在它保护的代码或 slice 下的 feature-local `__tests__` 文件夹中，而不是集中放在 package 级 `src/__tests__` 下

## 延伸阅读

- [defineApi 指南](./define-api.md)
- [React 测试指南](./react-testing.md)
- [Node Utils 指南](./node-utils.md)
