# Changelog

FaasJS use [Semantic Versioning](https://semver.org/).

## Stable

[`v7.0.0 (2025-04-06)`](https://github.com/faasjs/faasjs/compare/v6.12.3...v7.0.0)

- `@faasjs/server`
  - [Break] All header names are lowercase.
  - [Break] 3rd of middleware argument changes to `MiddlewareContext`.
  - [Feature] Enhanced port binding notifications.
  - [Feature] Add `beforeHandle` to `Server`.
  - [Feature] The `staticHandler`'s `notFound` option supports string path as fallback path.

- `@faasjs/cli`
  - [Feature] Add `faas dev` command to start a development server.

- `@faasjs/cloud_function`
  - [Fix] Support `export const func = useFunc(...)` syntax.

[`v6.12.3 (2025-04-06)`](https://github.com/faasjs/faasjs/compare/v6.11.1...v6.12.3)

- `@faasjs/ant-design`
  - [Feature] Using Ant Design's message component as the default error notification when API calls fail, providing a consistent and user-friendly error feedback mechanism.
  - [Fix] Fix styleProviderProps defaults.

[`v6.11.1 (2025-04-04)`](https://github.com/faasjs/faasjs/compare/v6.11.0...v6.11.1)

- `@faasjs/server`
  - [Fix] Fix `middleware` to handle option request.

[`v6.11.0 (2025-04-02)`](https://github.com/faasjs/faasjs/compare/v6.10.0...v6.11.0)

- `@faasjs/server`
  - [Feature] Add `middleware` to `Server`.

- `faasjs`
  - [Fix] Fix `tsconfig.react.json`.

- `@faasjs/react`
  - [Fix] Fix reload error.

[`v6.10.0 (2025-03-30)`](https://github.com/faasjs/faasjs/compare/v6.9.0...v6.10.0)

- `@faasjs/server`
  - [Feature] Add `getRouteFiles` to get all route files.

[`v6.9.0 (2025-03-23)`](https://github.com/faasjs/faasjs/compare/v6.8.0...v6.9.0)

- Remove unused dependencies: lodash, typescript.

- `@faasjs/logger`
  - [Feature] Add `FaasLogTransport` environment variable to enable/disable transports.

[`v6.8.0 (2025-03-09)`](https://github.com/faasjs/faasjs/compare/v6.7.0...v6.8.0)

- `@faasjs/logger`
  - [Feature] Added browser compatibility, allowing the logger to be used directly in browser environments.

[`v6.7.0 (2025-02-24)`](https://github.com/faasjs/faasjs/compare/v6.6.0...v6.7.0)

- `@faasjs/func`
  - [Feature] Support `export const func = useFunc(...)` syntax.

- `@faasjs/load`
  - [Feature] `loadPackage` support `defaultNames`.

[`v6.6.0 (2025-02-17)`](https://github.com/faasjs/faasjs/compare/v6.5.0...v6.6.0)

- `@faasjs/ant-design`
  - [Feature] Replace upperFirst with idToTitle for title generation consistency.
  - [Feature] Export `FaasDataWrapperRef` from `@faasjs/react`.
  - [Fix] Use nullish coalescing for title assignment in Description, Table, and Tabs components.

[`v6.5.0 (2025-02-16)`](https://github.com/faasjs/faasjs/compare/v6.4.3...v6.5.0)

- `@faasjs/logger`
  - [Feature] Add `disableTransport`.
  - [Fix] Add length limit to formatter.

[`v6.4.3 (2025-01-31)`](https://github.com/faasjs/faasjs/compare/v6.3.2...v6.4.3)

- `@faasjs/types`, `@faasjs/browser`, `@faasjs/react` and `@faasjs/ant-design`
  - [Feature] Add `FaasActionUnionType` type and change `FaasAction` to infer action's type.

- `@faasjs/react` and `@faasjs/ant-design`
  - [Feature] Add `ref` to `FaasDataWrapper`.

- `@faasjs/ant-design`
  - [Feature] Add `useThemeToken`.
  - [Feature] Don't render table and description column when children or render is null.
  - [Fix] Fix `tableRender`.
  - [Fix] Fix `UnionFaasItemProps`.

[`v6.3.2 (2025-01-30)`](https://github.com/faasjs/faasjs/compare/v6.3.1...v6.3.2)

- `@faasjs/ant-design`
  - [Fix] Fix Form's `hidden` bug.

[`v6.3.1 (2025-01-29)`](https://github.com/faasjs/faasjs/compare/v6.3.0...v6.3.1)

- `@faasjs/ant-design`
  - [Fix] Fix Form's `if` bug.

[`v6.3.0 (2025-01-27)`](https://github.com/faasjs/faasjs/compare/v6.2.0...v6.3.0)

- `faasjs`
  - [Feature] tsconfig templates add `exactOptionalPropertyTypes`,`strictNullChecks` and `noEmit`.

- `@faasjs/server`
  - [Feature] Add `stripPrefix` to `staticHandler`.
  - [Feature] `cache` can be a string as cacheKey to `staticHandler`.

- `@faasjs/lint`
  - [Feature] Change `useExhaustiveDependencies` to `warn` by default.

[`v6.2.0 (2025-01-24)`](https://github.com/faasjs/faasjs/compare/v6.1.0...v6.2.0)

- `faasjs`
  - [Feature] Add tsconfig templates, you can use `faasjs/tsconfig.base`, `faasjs/tsconfig.react` and `faasjs/tsconfig.build` in your project's tsconfig.

- `@faasjs/ant-design`
  - [Feature] Auto disable BrowserRouter when not in browser.

[`v6.1.0 (2025-01-19)`](https://github.com/faasjs/faasjs/compare/v6.0.0...v6.1.0)

- `@faasjs/browser`
  - [Feature] Extend `ResponseError` to support string or Error as parameter.

- `@faasjs/server`
  - [Feature] Add `onStart` to `Server`.

[`v6.0.0 (2025-01-10)`](https://github.com/faasjs/faasjs/compare/v5.0.1...v6.0.0)

- `@faasjs/server`
  - [Break] Remove cache option, cache is always working, for develop, please use [`tsx watch`](https://tsx.is/watch-mode) instead.

- `@faasjs/test`
  - [Break] Don't support filename as argument, only support Func.

- `@faasjs/load`
  - [Feature] Add `detectNodeRuntime` and `loadPackage` for dynamic load .func.ts file.

[`v5.0.1 (2025-01-02)`](https://github.com/faasjs/faasjs/compare/v4.7.2...v5.0.1)

Happy New Year! 🎉

- [Break] Convert all packages to esm.
- [Break] Remove `@faasjs/mongo`, `@faasjs/vue-plugin`.
- [Break] Replace jest with vitest.

- `@faasjs/server`
  - [Feature] Add logger to server's handler.
  - [Feature] Stop logger transport when server close.

- `@faasjs/logger`
  - [Break] Move `@faasjs/logger/transport` to `@faasjs/logger`.
  - [Break] Move all transports api to `getTransport`.

[`v4.7.2 (2024-12-25)`](https://github.com/faasjs/faasjs/compare/v4.7.0...v4.7.2)

- `@faasjs/logger`
  - [Feature] Using `__hidden__` to hide argument for message.
  - [Fix] Hidden duration argument.

[`v4.7.0 (2024-12-24)`](https://github.com/faasjs/faasjs/compare/v4.6.0...v4.7.0)

- `@faasjs/logger`
  - [Feature] Add labels and extra to logger.

[`v4.6.0 (2024-12-23)`](https://github.com/faasjs/faasjs/compare/v4.5.3...v4.6.0)

- `@faasjs/logger`
  - [Feature] Move transport to `@faasjs/logger/transport`.

- `@faasjs/server`
  - [Feature] Add `onClose`.

[`v4.5.3 (2024-12-22)`](https://github.com/faasjs/faasjs/compare/v4.5.1...v4.5.3)

- `@faasjs/logger`
  - [Fix] Fix freezed existing logger.

- `@faasjs/server`
  - [Feature] Add cache to staticHandler.

[`v4.5.1 (2024-12-21)`](https://github.com/faasjs/faasjs/compare/v4.4.0...v4.5.1)

- `@faasjs/logger`
  - [Feature] Add `Transport`.

[`v4.4.0 (2024-12-14)`](https://github.com/faasjs/faasjs/compare/v4.3.0...v4.4.0)

- `@faasjs/func`
  - [Feature] Add `nameFunc` for improve logger.
  - [Feature] Update logger.

- `@faasjs/server`
  - [Fix] Fix staticHandler's name.

- `@faasjs/load`
  - [Feature] Update logger.

[`v4.3.0 (2024-12-10)`](https://github.com/faasjs/faasjs/compare/v4.2.6...v4.3.0)

- `@faasjs/server`
  - [Feature] Monitor `SIGTERM` and `SIGINT` to exit smoothly.
  - [Feature] Improve server logger.

[`v4.2.6 (2024-12-09)`](https://github.com/faasjs/faasjs/compare/v4.1.0...v4.2.6)

- `@faasjs/server`
  - [Feature] Add `useMiddleware` and `useMiddlewares`.
  - [Feature] Add `staticHandler`.
  - [Fix] Output all error message.

- `@faasjs/load`
  - [Fix] Remove unused `loadTs`.

[`v4.1.0 (2024-12-07)`](https://github.com/faasjs/faasjs/compare/v3.7.1...v4.1.0)

- `@faasjs/react`
  - [Break] Upgrade react to 19.
  - [Feature] Add `useStateRef` hook.
  - [Feature] Improve `FormContainer` performance.
  - [Fix] Rename FormButton's `disabled` to `submitting`.
  - [Fix] Fix form errors.

- `@faasjs/ant-design`
  - [Break] Upgrade react to 19.

- `@faasjs/http`
  - [Break] Remove validator.(Recommend to use [zod](https://zod.dev/) instead)

[`v3.7.1 (2024-11-10)`](https://github.com/faasjs/faasjs/compare/v3.7.0...v3.7.1)

- `@faasjs/react`
  - [Fix] Fix custom input.

[`v3.7.0 (2024-11-10)`](https://github.com/faasjs/faasjs/compare/v3.6.1...v3.7.0)

- `@faasjs/react`
  - [Feature] Add headless form.
  - [Feature] Add display name to improve debugging.
  - [Feature] Add `initializeStates` to `createSplittingContext`.
  - [Feature] Add `usePrevious` hook.
  - [Fix] Fix `equal` error.

[`v3.6.1 (2024-10-23)`](https://github.com/faasjs/faasjs/compare/v3.6.0...v3.6.1)

- `@faasjs/react`
  - [Fix] Export `useSplittingState`.

[`v3.6.0 (2024-10-19)`](https://github.com/faasjs/faasjs/compare/v3.5.2...v3.6.0)

- `@faasjs/server`
  - [Feature] Support for [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).

[`v3.5.2 (2024-10-16)`](https://github.com/faasjs/faasjs/compare/v3.5.0...v3.5.2)

- `@faasjs/react`
  - [Fix] Fix `createSplittingContext` type.
  - [Fix] Fix AsyncFunction for `equal`.

- `@faasjs/ant-design`
  - [Fix] Fix `ConfigProvider`'s language handling to support server renderer.

[`v3.5.0 (2024-10-15)`](https://github.com/faasjs/faasjs/compare/v3.4.0...v3.5.0)

- `@faasjs/browser`
  - [Feature] Simplify mock responses in tests and update Response constructor.
  - [Feature] Add `length` to `generateId`.

- `@faasjs/react`
  - [Feature] Support special type for createSplittingContext's provider and use.

- `@faasjs/lint`
  - [Fix] Disable biome for `.astro` files.

- `@faasjs/http`
  - [Feature] Add `useHttpFunc`.

[`v3.4.0 (2024-10-01)`](https://github.com/faasjs/faasjs/compare/v3.3.0...v3.4.0)

- `@faasjs/react`
  - [Feature] Add `useSplittingState`.
  - [Feature] Add `memo` to `createSplittingContext`'s `Provider`.

[`v3.3.0 (2024-09-30)`](https://github.com/faasjs/faasjs/compare/v3.2.1...v3.3.0)

- `@faasjs/types`
  - [Feature] Add `InferFaasAction`.

[`v3.2.1 (2024-09-24)`](https://github.com/faasjs/faasjs/compare/v3.2.0...v3.2.1)

- Move `dependencies` to `peerDependencies`.

[`v3.2.0 (2024-09-20)`](https://github.com/faasjs/faasjs/compare/v3.1.2...v3.2.0)

- `@faasjs/server`
  - [Feature] Add raw request and response to `event`.

- `@faasjs/browser`
  - [Fix] Fix url.

- `@faasjs/react`
  - [Fix] Fix faas.

[`v3.1.2 (2024-09-17)`](https://github.com/faasjs/faasjs/compare/v3.0.0...v3.1.2)

- `@faasjs/react`
  - [Feature] Add custom compare function `equal` and hooks: `useEqualMemoize`, `useEqualEffect`, `useEqualMemo` and `useEqualCallback`.
  - [Feature] Using new compare function to improve all components and hooks' performance.

- `@faasjs/knex`
  - [Feature] Client can be a npm package with `npm:` prefix.

- `@faasjs/func`
  - [Feature] Improve logger.

- `@faasjs/nextjs`
  - [Feature] Export logger to context.

[`v3.0.0 (2024-09-16)`](https://github.com/faasjs/faasjs/compare/v2.9.0...v3.0.0)

- [Break] Remove `@faasjs/deployer`, `@faasjs/tencentcloud`.
- [Break] Upgrade node version to 22.

- `@faasjs/browser`
  - [Break] `baseURL` is optional and must be end with `/`.
  - [Feature] `action` can be a react server action.

- `@faasjs/react`
  - [Break] `domain` rename to `baseURL`.
  - [Feature] `action` can be a react server action.
  - [Fix] Fix types.

- `@faasjs/vue-plugin`
  - [Break] `domain` rename to `baseURL`.

- `@faasjs/server`
  - [Feature] Disable code transformation in Bun.

[`v2.9.0 (2024-09-12)`](https://github.com/faasjs/faasjs/compare/v2.8.1...v2.9.0)

- Add deprecated notice to below packages:
  - `@faasjs/deployer`
  - `@faasjs/load`
  - `@faasjs/tencentcloud`

- Add deprecated notice to `@faasjs/http`'s `Validator`.

[`v2.8.1 (2024-09-10)`](https://github.com/faasjs/faasjs/compare/v2.8.0...v2.8.1)

- `@faasjs/react`
  - [Fix] Fix `withFaasData`'s type.

- `@faasjs/ant-design`
  - [Fix] Fix `withFaasData`'s type.

[`v2.8.0 (2024-09-09)`](https://github.com/faasjs/faasjs/compare/v2.7.0...v2.8.0)

- `@faasjs/react`
  - [Feature] Add `withFaasData`.

- `@faasjs/ant-design`
  - [Feature] Add `withFaasData`.
  - [Feature] `Link`'s button can be boolean.
  - [Fix] Fix `FaasAction` types.

[`v2.7.0 (2024-09-06)`](https://github.com/faasjs/faasjs/compare/v2.6.1...v2.7.0)

- `@faasjs/react`
  - [Feature] Add `OptionalWrapper`.

- `@faasjs/ant-design`
  - [Feature] `App`'s `styleProviderProps` and `browserRouterProps` can be disabled by `false`.
  - [Fix] Fix `Form`'s `initialValues` to `Partial<Values>`.

[`v2.6.1 (2024-08-31)`](https://github.com/faasjs/faasjs/compare/v2.6.0...v2.6.1)

- `@faasjs/ant-design`
  - [Fix] Fix form items type.

[`v2.6.0 (2024-08-29)`](https://github.com/faasjs/faasjs/compare/v2.5.2...v2.6.0)

- [Feature] Add `exports` to all packages' `package.json`.
- [Feature] Release new package: `@faasjs/lint`.

[`v2.5.2 (2024-08-26)`](https://github.com/faasjs/faasjs/compare/v2.4.0...v2.5.2)

- `@faasjs/react`
  - [Feature] Auto generate default FaasReactClient, not throw error when not initialized.

[`v2.4.0 (2024-07-26)`](https://github.com/faasjs/faasjs/compare/v2.3.1...v2.4.0)

- `@faasjs/react`
  - [Feature] Rename `createSplitedContext` to `createSplittingContext`.
  - [Feature] Add more document to `createSplittingContext`.

[`v2.3.1 (2024-05-13)`](https://github.com/faasjs/faasjs/compare/v2.3.0...v2.3.1)

- `@faasjs/react`
  - [Fix] `createSplitedContext`'s defaultValue can be null.

- `@faasjs/ant-design`
  - [Fix] Use `React.Dispatch<SetStateAction>` to define modal and drawer types.

[`v2.3.0 (2024-05-10)`](https://github.com/faasjs/faasjs/compare/v2.2.0...v2.3.0)

- `@faasjs/react`
  - [Feature] Optimize `createSplitedContext`.

[`v2.2.0 (2024-03-13)`](https://github.com/faasjs/faasjs/compare/v2.1.0...v2.2.0)

- `@faasjs/func`
  - [Feature] Add `FuncParamsType` and `FuncReturnType`.

- `create-faas-app`
  - [Feature] Simplify options.

[`v2.1.0 (2024-03-08)`](https://github.com/faasjs/faasjs/compare/v2.0.0...v2.1.0)

- `@faasjs/react`
  - [Feature] Add `createSplitedContext`.

- `@faasjs/ant-design`
  - [Feature] Simplify `App` with `createSplitedContext`.

[`v2.0.0 (2024-02-28)`](https://github.com/faasjs/faasjs/compare/v1.7.2...v2.0.0)

- `@faasjs/react`
  - [Break] Remove `@preact/signals-react`.

[`v1.7.2 (2024-02-27)`](https://github.com/faasjs/faasjs/compare/v1.7.1...v1.7.2)

- `@faasjs/react`
  - [Fix] Fix loading's render issue.

- `@faasjs/ant-design`
  - [Fix] Fix Table's loading state.

[`v1.7.1 (2024-02-25)`](https://github.com/faasjs/faasjs/compare/v1.7.0...v1.7.1)

- `@faasjs/jest`
  - [Fix] Fix dependences, remove `@faasjs/test`.

[`v1.7.0 (2024-02-24)`](https://github.com/faasjs/faasjs/compare/v1.6.0...v1.7.0)

- `create-faas-app`
  - [Feature] Support Bun.
  - [Fix] Fix example file.

- `@faasjs/logger`
  - [Feature] Refactor Logger class initialization.

[`v1.6.0 (2024-01-29)`](https://github.com/faasjs/faasjs/compare/v1.5.0...v1.6.0)

- `@faasjs/react`
  - [Feature] Add `useConstant`.

- `@faasjs/ant-design`
  - [Feature] Reduce `App` re-render times.

[`v1.5.0 (2024-01-29)`](https://github.com/faasjs/faasjs/compare/v1.4.2...v1.5.0)

- `@faasjs/ant-design`
  - [Feature] Support [why-did-you-render](https://github.com/welldone-software/why-did-you-render).
  - [Feature] Drawer and Modal support function as change handler.

[`v1.4.2 (2024-01-22)`](https://github.com/faasjs/faasjs/compare/v1.4.1...v1.4.2)

- `@faasjs/knex`
  - [Fix] Fix transaction return value.

- `@faasjs/logger`
  - [Fix] Fix error log outputs.

[`v1.4.1 (2024-01-20)`](https://github.com/faasjs/faasjs/compare/v1.3.2...v1.4.1)

- `@faasjs/knex`
  - [Feature] Add `commit` and `rollback` events to `transaction`.
  - [Feature] Improve logger.

- `@faasjs/request`
  - [Feature] Improve json parse.

- `@faasjs/redis`
  - [Feature] Add lock success log.
  - [Fix] Fix logger label.

[`v1.3.2 (2024-01-06)`](https://github.com/faasjs/faasjs/compare/v1.3.0...v1.3.2)

- `@faasjs/request`
  - [Feature] Display requestId in log.
  - [Fix] Fix downloadFile and downloadStream's logger.

- `@faasjs/ant-design`
  - [Fix] Fix `Tabs`'s item's type define.

[`v1.3.0 (2024-01-03)`](https://github.com/faasjs/faasjs/compare/v1.2.0...v1.3.0)

- `@faasjs/logger`
  - [Feature] Add `FaasLogMode`.

- `@faasjs/request`, `@faasjs/redis`, `@faasjs/server`
  - [Fix] Use internal logger.

- `@faasjs/knex`
  - [Fix] Improve log format.

[`v1.2.0 (2023-12-31)`](https://github.com/faasjs/faasjs/compare/v1.1.1...v1.2.0)

- `@faasjs/request`
  - [Feature] Add default timeout (5000 as 5s).

- `@faasjs/func`
  - [Feature] Improve logger.

[`v1.1.1 (2023-12-29)`](https://github.com/faasjs/faasjs/compare/v1.1.0...v1.1.1)

- `@faasjs/ant-design`
  - [Fix] Fix transfer array types.

[`v1.1.0 (2023-12-26)`](https://github.com/faasjs/faasjs/compare/v1.0.0...v1.1.0)

- `@faasjs/http`
  - [Feature] Lowercase header names.

- `@faasjs/server`
  - [Feature] Lowercase header names.
  - [Feature] Add all headers to Access-Control-Allow-Headers.
  - [Feature] Add Access-Control-Expose-Headers.

- `@faasjs/browser`
  - [Feature] Add `headers` to `beforeRequest`.

[`v1.0.0 (2023-12-23)`](https://github.com/faasjs/faasjs/compare/v0.0.5-beta.6...v1.0.0)

- [Feature] Release first stable version.

- `@faasjs/react`
  - [Feature] Export `useSignals`.

## Beta

[`v0.0.5-beta.6 (2023-12-23)`](https://github.com/faasjs/faasjs/compare/v0.0.5-beta.5...v0.0.5-beta.6)

- `@faasjs/react`
  - [Feature] Upgrade `@preact/signal-react` to `^2.0.0`.

- `@faasjs/redis`
  - [Feature] Improve locking log.

[`v0.0.5-beta.5 (2023-12-19)`](https://github.com/faasjs/faasjs/compare/v0.0.5-beta.3...v0.0.5-beta.5)

- `@faasjs/ant-design`
  - [Fix] Fix `Table` items re-render issue.

- `@faasjs/server`
  - [Feature] Support deep path default function.

[`v0.0.5-beta.3 (2023-12-14)`](https://github.com/faasjs/faasjs/compare/v0.0.5-beta.2...v0.0.5-beta.3)

- `@faasjs/ant-design`
  - [Fix] Fix time input.

[`v0.0.5-beta.2 (2023-12-12)`](https://github.com/faasjs/faasjs/compare/v0.0.5-beta.1...v0.0.5-beta.2)

- `@faasjs/knex`
  - [Feature] Improve logger.

- `@faasjs/react`
  - [Feature] Add `useSignalState`.

[`v0.0.5-beta.1 (2023-12-04)`](https://github.com/faasjs/faasjs/compare/v0.0.4-beta.16...v0.0.5-beta.1)

- `@faasjs/ant-design`
  - [Break] Change ConfigProvider's config to theme.
  - [Feature] Add FaasClientOptions to ConfigProvider.

- `@faasjs/request`
  - [Feature] Update logger.

[`v0.0.4-beta.16 (2023-12-03)`](https://github.com/faasjs/faasjs/compare/v0.0.4-beta.15...v0.0.4-beta.16)

- `@faasjs/ant-design`
  - [Feature] Add FaasJS's ConfigProvider to App.

- `@faasjs/request`
  - [Feature] Support gzip and br encoding.

[`v0.0.4-beta.15 (2023-12-01)`](https://github.com/faasjs/faasjs/compare/v0.0.4-beta.14...v0.0.4-beta.15)

- `@faasjs/eslint-config-recommended`
  - [Break] Remove package.

- `@faasjs/eslint-config-react`
  - [Break] Remove package.

- `@faasjs/eslint-config-vue`
  - [Break] Remove package.

- `@faasjs/linter`
  - [Break] Remove package.

- `@faasjs/ant-design`
  - [Feature] Add ErrorBoundary to App.

[`v0.0.4-beta.14 (2023-11-30)`](https://github.com/faasjs/faasjs/compare/v0.0.4-beta.12...v0.0.4-beta.14)

- `@faasjs/ant-design`
  - [Feature] Table's columns support `filterDropdown: false` and `sorter: false`.

[`v0.0.4-beta.12 (2023-11-29)`](https://github.com/faasjs/faasjs/compare/v0.0.4-beta.11...v0.0.4-beta.12)

- `@faasjs/react`
  - [Feature] Add `signal` feature, based on [@preact/signals-react](https://preactjs.com/guide/v10/signals).

[`v0.0.4-beta.11 (2023-11-19)`](https://github.com/faasjs/faasjs/compare/v0.0.4-beta.10...v0.0.4-beta.11)

- `@faasjs/redis`
  - [Feature] Remove unnecessary types.

- `@faasjs/logger`
  - [Fix] Fix logger size.

[`v0.0.4-beta.10 (2023-11-05)`](https://github.com/faasjs/faasjs/compare/v0.0.4-beta.9...v0.0.4-beta.10)

- `@faasjs/request`
  - [Feature] When request failed, return `ResponseError` instead of `Error`.

[`v0.0.4-beta.9 (2023-10-24)`](https://github.com/faasjs/faasjs/compare/v0.0.4-beta.7...v0.0.4-beta.9)

- [Feature] Improve dependencies.

[`v0.0.4-beta.7 (2023-10-23)`](https://github.com/faasjs/faasjs/compare/v0.0.4-beta.6...v0.0.4-beta.7)

- `@faasjs/func`
  - [Feature] Improve logger for mono mode.

- `@faasjs/http`
  - [Feature] Improve logger for mono mode.

[`v0.0.4-beta.6 (2023-10-20)`](https://github.com/faasjs/faasjs/compare/v0.0.4-beta.5...v0.0.4-beta.6)

- `@faasjs/knex`
  - [Feature] `transaction` add `options: { trx: Knex.Transaction }` (Thanks contributor: [@Witt](https://github.com/WittCsharp)).
  - [Feature] Export `originKnex` and `OriginKnex`.

[`v0.0.4-beta.5 (2023-10-17)`](https://github.com/faasjs/faasjs/compare/v0.0.4-beta.4...v0.0.4-beta.5)

- `@faasjs/test`
  - [Break] `jest.setup.js` moved to `@faasjs/jest`.

[`v0.0.4-beta.4 (2023-10-16)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.109...v0.0.4-beta.4)

- `@faasjs/react`
  - [Feature] `skip` can be a function.

[`v0.0.3-beta.109 (2023-09-22)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.108...v0.0.3-beta.109)

- `@faasjs/server`
  - [Feature] Improve logger.

[`v0.0.3-beta.108 (2023-09-21)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.107...v0.0.3-beta.108)

- `@faasjs/linter`
  - [Feature] Add `@faasjs/linter` based on [biome](https://biomejs.dev/).

[`v0.0.3-beta.107 (2023-09-14)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.105...v0.0.3-beta.107)

- `@faasjs/http`
  - [Fix] Fix clone params.

[`v0.0.3-beta.105 (2023-09-13)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.104...v0.0.3-beta.105)

- `@faasjs/http`
  - [Feature] Add `data.event.params` as cloned params.

[`v0.0.3-beta.104 (2023-09-05)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.101...v0.0.3-beta.104)

- `@faasjs/browser`
  - [Feature] Add `setMock` for testing.

- `@faasjs/ant-design`
  - [Feature] Add `onClick` to `Link`.
  - [Fix] Avoid `Link` return null.

[`v0.0.3-beta.101 (2023-09-03)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.100...v0.0.3-beta.101)

- `@faasjs/ant-design`
  - [Fix] Fix `Link` global style.

[`v0.0.3-beta.100 (2023-08-29)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.98...v0.0.3-beta.100)

- `@faasjs/ant-design`
  - [Fix] Fix `Link` style.
  - [Fix] Fix `Link` onClick bug.

[`v0.0.3-beta.98 (2023-08-26)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.97...v0.0.3-beta.98)

- `@faasjs/ant-design`
  - [Feature] Add `copyable` to `Link`.

[`v0.0.3-beta.97 (2023-08-25)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.96...v0.0.3-beta.97)

- `@faasjs/react`
  - [Feature] Export `reloadTime` from `useFaas`.

[`v0.0.3-beta.96 (2023-08-19)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.95...v0.0.3-beta.96)

- `@faasjs/react`
  - [Feature] Add `debounce` to `useFaas`.

[`v0.0.3-beta.95 (2023-08-17)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.94...v0.0.3-beta.95)

- `@faasjs/ant-design`
  - [Fix] Fix Descriptions' renderTitle.

- `@faasjs/server`
  - [Feature] Add `onError`.

[`v0.0.3-beta.94 (2023-08-16)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.92...v0.0.3-beta.94)

- `@faasjs/http`
  - [Fix] Fix params parse.

- `@faasjs/react`
  - [Feature] `ErrorBoundary`'s onError be opitonal.

- `@faasjs/knex`
  - [Feature] Make logger be public.

[`v0.0.3-beta.92 (2023-08-10)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.91...v0.0.3-beta.92)

- `@faasjs/react`
  - [Feature] add `ErrorBoundary`.

[`v0.0.3-beta.91 (2023-08-07)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.90...v0.0.3-beta.91)

- `@faasjs/cloud_function`
  - [Feature] Add request_id to invoked funciton.

[`v0.0.3-beta.90 (2023-08-06)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.89...v0.0.3-beta.90)

- `@faasjs/ant-design`
  - [Fix] Fix Descriptions' renderTitle.

[`v0.0.3-beta.89 (2023-08-04)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.88...v0.0.3-beta.89)

- `@faasjs/ant-design`
  - [Feature] Upgrade antd version to ~5.8.0.

- `@faasjs/request`
  - [Feature] Update error message.

[`v0.0.3-beta.88 (2023-07-31)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.87...v0.0.3-beta.88)

- `@faasjs/server`
  - [Feature] Add `X-FaasJS-Timing-Pending`, `X-FaasJS-Timing-Processing`, `X-FaasJS-Timing-Total` to header.

- `@faasjs/http`
  - [Fix] Fix cookie and session's logger.

[`v0.0.3-beta.87 (2023-07-20)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.86...v0.0.3-beta.87)

- `@faasjs/react`
  - [Feature] Ignore React Native's fetch abort.

[`v0.0.3-beta.86 (2023-07-19)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.85...v0.0.3-beta.86)

- `@faasjs/eslint-config-recommended`
  - [Feature] Add more rules.

[`v0.0.3-beta.85 (2023-07-01)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.84...v0.0.3-beta.85)

- `@faasjs/server`
  - [Fix] Fix Access-Control-Allow-Headers.

[`v0.0.3-beta.84 (2023-06-29)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.83...v0.0.3-beta.84)

- `@faasjs/browser` & `@faasjs/server` & `@faasjs/http`
  - [Feature] Add new `X-FaasJS-Request-Id` header.

[`v0.0.3-beta.83 (2023-06-05)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.82...v0.0.3-beta.83)

- `@faasjs/ant-design`
  - [Feature] Display radio when options length less than 11.

[`v0.0.3-beta.82 (2023-05-18)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.81...v0.0.3-beta.82)

- `@faasjs/server`
  - [Feature] Split process with path.

[`v0.0.3-beta.81 (2023-05-16)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.79...v0.0.3-beta.81)

- `@faasjs/react`
  - [Feature] Add auto retry to `useFaas`.

[`v0.0.3-beta.79 (2023-04-26)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.78...v0.0.3-beta.79)

- `@faasjs/knex`
  - [Feature] Add json convert to pg.

- `@faasjs/logger`
  - [Feature] Add FaasLogSize.

[`v0.0.3-beta.78 (2023-04-18)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.77...v0.0.3-beta.78)

- `@faasjs/request`
  - [Feature] Output debug logger for mock.

- `@faasjs/ant-design`
  - [Feature] Export faas functions.

[`v0.0.3-beta.77 (2023-04-12)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.76...v0.0.3-beta.77)

- `@faasjs/ant-design`
  - [Fix] Fix null item.

[`v0.0.3-beta.76 (2023-04-02)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.75...v0.0.3-beta.76)

- `@faasjs/ant-design`
  - [Fix] Fix Tabs' label.

[`v0.0.3-beta.75 (2023-03-30)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.74...v0.0.3-beta.75)

- `@faasjs/ant-design`
  - [Fix] Fix item type.

[`v0.0.3-beta.74 (2023-03-23)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.73...v0.0.3-beta.74)

- `@faasjs/ant-design`
  - [Fix] Fix Table extra.

- `@faasjs/react`
  - [Fix] Fix params.

[`v0.0.3-beta.73 (2023-03-19)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.72...v0.0.3-beta.73)

- `@faasjs/react`
  - [Fix] Fix action missing.

- `@faasjs/request`
  - [Feature] Display url in error message.

[`v0.0.3-beta.72 (2023-03-17)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.70...v0.0.3-beta.72)

- `@faasjs/react`
  - [Feature] Export `setParams`.

[`v0.0.3-beta.70 (2023-03-12)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.69...v0.0.3-beta.70)

- `@faasjs/ant-design`
  - [Feature] Add `Tabs` component.

[`v0.0.3-beta.68 (2023-03-05)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.65...v0.0.3-beta.68)

- `@faasjs/ant-design`
  - [Feature] Improve dropdown render.
  - [Fix] Fix table loading.

[`v0.0.3-beta.65 (2023-03-04)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.63...v0.0.3-beta.65)

- `@faasjs/ant-design`
  - [Feature] Add date picker to date and time items.

[`v0.0.3-beta.63 (2023-03-02)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.62...v0.0.3-beta.63)

- `@faasjs/ant-design`
  - [Fix] Fix boolean filter.

[`v0.0.3-beta.62 (2023-02-27)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.61...v0.0.3-beta.62)

- `@faasjs/ant-design`
  - [Fix] Fix filter.

[`v0.0.3-beta.61 (2023-02-21)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.59...v0.0.3-beta.61)

- `@faasjs/ant-design`
  - [Feature] Use Select as filters.
  - [Fix] Fix filterDropdown.

[`v0.0.3-beta.59 (2023-02-18)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.57...v0.0.3-beta.59)

- `@faasjs/knex`
  - [Feature] Update pool config.

[`v0.0.3-beta.57 (2023-02-16)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.56...v0.0.3-beta.57)

- `@faasjs/ant-design`
  - [Fix] Fix null value.

- `@faasjs/redis`
  - [Fix] Fix disconnect.

[`v0.0.3-beta.56 (2023-02-15)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.55...v0.0.3-beta.56)

- `@faasjs/ant-design`
  - [Feature] Add BrowserRouter to App.

[`v0.0.3-beta.55 (2023-02-14)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.51...v0.0.3-beta.55)

- `@faasjs/ant-design`
  - [Fix] Fix App style.

[`v0.0.3-beta.51 (2023-02-12)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.50...v0.0.3-beta.51)

- `@faasjs/ant-design`
  - [Feature] Add `App` component.

[`v0.0.3-beta.50 (2023-02-09)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.49...v0.0.3-beta.50)

- `@faasjs/knex`
  - [Feature] Add default pg config.

[`v0.0.3-beta.49 (2023-02-08)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.47...v0.0.3-beta.49)

- `@faasjs/ant-design`
  - [Fix] Fix time sorter.

[`v0.0.3-beta.47 (2023-02-07)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.46...v0.0.3-beta.47)

- `@faasjs/redis`
  - [Feature] Add lock and unlock.

[`v0.0.3-beta.46 (2023-02-06)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.45...v0.0.3-beta.46)

- `@faasjs/request`
  - [Feature] Return Error.

[`v0.0.3-beta.45 (2023-02-04)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.44...v0.0.3-beta.45)

- `@faasjs/ant-design`
  - [Fix] Fix boolean filter.

[`v0.0.3-beta.44 (2023-02-02)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.43...v0.0.3-beta.44)

- `@faasjs/test`
  - [Feature] Add `.ts` to filename.

[`v0.0.3-beta.43 (2023-02-01)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.40...v0.0.3-beta.43)

- `@faasjs/ant-design`
  - [Feature] Add extra to list.
  - [Fix] Fix FaasData.

[`v0.0.3-beta.40 (2023-01-30)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.36...v0.0.3-beta.40)

- [Feature] Use peerDependence.

[`v0.0.3-beta.36 (2023-01-27)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.35...v0.0.3-beta.36)

- `@faasjs/ant-design`
  - [Remove] Remove ErrorBoundary.
  - [Fix] Remove unused log.

- `@faasjs/request`
  - [Fix] Improve parse.

[`v0.0.3-beta.35 (2023-01-24)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.32...v0.0.3-beta.35)

- `@faasjs/ant-design`
  - [Feature] Add block to Link.
  - [Fix] Fix link style.

[`v0.0.3-beta.32 (2023-01-23)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.31...v0.0.3-beta.32)

- `@faasjs/ant-design`
  - [Feature] Add type `UnionFaasItem`.
  - [Feature] Add loading to wrapper.
  - [Feature] Add children to Loading.

[`v0.0.3-beta.31 (2023-01-22)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.30...v0.0.3-beta.31)

- `@faasjs/redis`
  - [Feature] Add multi and pipeline.

[`v0.0.3-beta.30 (2023-01-19)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.29...v0.0.3-beta.30)

- `@faasjs/http`
  - [Feature] Export cookie and session.

[`v0.0.3-beta.29 (2023-01-18)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.24...v0.0.3-beta.29)

- `@faasjs/ant-design`
  - [Feature] Add async to submit.
  - [Feature] Export Form.List, Form.ErrorList and Form.Provider.
  - [Feature] Add `Loading` and `FaasDataWrapper`.

[`v0.0.3-beta.24 (2023-01-17)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.23...v0.0.3-beta.24)

- `@faasjs/ant-design`
  - [Fix] Fix empty filter.

[`v0.0.3-beta.23 (2023-01-16)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.21...v0.0.3-beta.23)

- `@faasjs/ant-design`
  - [Fix] Fix filter.

[`v0.0.3-beta.21 (2023-01-15)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.19...v0.0.3-beta.21)

- `@faasjs/ant-design`
  - [Feature] Add options to FaasDataTable.
  - [Feature] Add children to FaasDataWrapper.

[`v0.0.3-beta.19 (2023-01-13)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.18...v0.0.3-beta.19)

- `@faasjs/http`
  - [Fix] Fix params.

[`v0.0.3-beta.18 (2023-01-11)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.17...v0.0.3-beta.18)

- `@faasjs/logger`
  - [Fix] Increase default log size.

[`v0.0.3-beta.17 (2023-01-10)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.16...v0.0.3-beta.17)

- `@faasjs/ant-design`
  - [Fix] Fix link text.

[`v0.0.3-beta.16 (2022-12-23)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.15...v0.0.3-beta.16)

- `@faasjs/ant-design`
  - [Feature] Update major types to interfaces.

[`v0.0.3-beta.15 (2022-12-16)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.11...v0.0.3-beta.15)

- `@faasjs/cloud_function`
  - [Fix] Fix local mode's path issue.
- `@faasjs/func`
  - [Feature] Let useify plugin returns plugin instance when it mounts.
- `@faasjs/http`
  - [Fix] Don't initialize cookie and session before mount.

[`v0.0.3-beta.11 (2022-12-13)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.10...v0.0.3-beta.11)

- `@faasjs/ant-design`
  - [Fix] Fix link with button.

[`v0.0.3-beta.10 (2022-12-08)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.8...v0.0.3-beta.10)

- `@faasjs/react`
  - [Fix] Auto cancel request when component unmount.

[`v0.0.3-beta.8 (2022-12-07)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.6...v0.0.3-beta.8)

- `@faasjs/ant-design`
  - [Feature] Add debug logs.
- `@faasjs/logger`
  - [Feature] Improve log outputs.

[`v0.0.3-beta.6 (2022-12-05)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.5...v0.0.3-beta.6)

- `@faasjs/cli`
  - [Fix] Rollback to use `lodash`.
- `@faasjs/server`
  - [Fix] Rollback to use `lodash`.
- `create-faas-app`
  - [Fix] Rollback to use `lodash`.

[`v0.0.3-beta.5 (2022-12-02)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.4...v0.0.3-beta.5)

- `@faasjs/ant-design`
  - [Fix] Fix `if` in FormItem.

[`v0.0.3-beta.4 (2022-11-28)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.3...v0.0.3-beta.4)

- `@faasjs/ant-design`
  - [Fix] Fix i18n for Table.

[`v0.0.3-beta.2 (2022-11-25)`](https://github.com/faasjs/faasjs/compare/v0.0.3-beta.2...v0.0.3-beta.3)

- `@faasjs/ant-design`
  - [Feature] Add null to table's options.

[`v0.0.3-beta.2 (2022-11-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.456...v0.0.3-beta.2)

- `@faasjs/ant-design`
  - [Break] Upgrade Ant Design to 5.x.
  - [Break] Use `lodash-es` instead of `lodash`.

[`v0.0.2-beta.406 (2022-09-01)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.404...v0.0.2-beta.406)

- [Feature] Replace peerDependencies with dependencies.
- `@faasjs/ant-design`
  - [Feature] Convert string to dayjs instance automatically when type is date or time.
  - [Fix] Fix extendTypes warning.

[`v0.0.2-beta.404 (2022-08-24)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.403...v0.0.2-beta.404)

- `@faasjs/knex`
  - [Fix] Fix query's typescript definition.

[`v0.0.2-beta.403 (2022-08-21)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.402...v0.0.2-beta.403)

- `@faasjs/redis`
  - [Fix] Fix logger.

[`v0.0.2-beta.402 (2022-08-20)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.400...v0.0.2-beta.402)
- `@faasjs/func`
  - [Fix] Fix logger for testing.
- `@faasjs/knex`
  - [Fix] Fix logger.

[`v0.0.2-beta.400 (2022-08-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.399...v0.0.2-beta.400)
- [Break] Add request_id to all logs.
- [Break] Add `node >= 16.0.0` to `package.json`.

[`v0.0.2-beta.399 (2022-08-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.398...v0.0.2-beta.399)

- `create-faas-app`
  - [Feature] Update script and files.
- `@faasjs/test`
  - [Fix] Fix the empty config issue.

[`v0.0.2-beta.398 (2022-08-07)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.397...v0.0.2-beta.398)

- `@faasjs/func`
  - [Fix] usePlugin will add mount automatically.

[`v0.0.2-beta.397 (2022-08-06)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.396...v0.0.2-beta.397)

- `@faasjs/aws`
  - [Break] Remove `@faasjs/aws` package.
- `@faasjs/react`
  - [Feature] Export more types from `@faasjs/types`.
- `@faasjs/func`
  - [Feature] Update documents.
  - [Remove] Remove export's config.

[`v0.0.2-beta.396 (2022-07-27)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.395...v0.0.2-beta.396)

- `@faasjs/knex`
  - [Fix] Fix query function params's type.

[`v0.0.2-beta.395 (2022-07-26)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.394...v0.0.2-beta.395)

- `@faasjs/request`
  - [Feature] Add English documents.

[`v0.0.2-beta.394 (2022-05-30)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.393...v0.0.2-beta.394)

- `@faasjs/http`
  - [Fix] Fix validator.

[`v0.0.2-beta.393 (2022-04-27)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.392...v0.0.2-beta.393)

- `@faasjs/ant-design`
  - [Feature] Support React 18.x.
- `@faasjs/jest`
  - [Feature] Support jest 28.x.

[`v0.0.2-beta.392 (2022-04-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.391...v0.0.2-beta.392)

- `create-faas-app`
  - [Break] Remove default provider.

[`v0.0.2-beta.391 (2022-04-01)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.390...v0.0.2-beta.391)

- `@faasjs/eslint-recommended`
  - [Feature] Remove slow rules.

[`v0.0.2-beta.390 (2022-03-30)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.389...v0.0.2-beta.390)

- `@faasjs/ant-design`
  - [Break] Remove `react-use` dependency.

[`v0.0.2-beta.389 (2022-03-25)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.385...v0.0.2-beta.389)

- `@faasjs/http`
  - [Feature] Add originBody to all response.
  - [Fix] Fix response.
- `@faasjs/knex`
  - [Break] Use `better-sqlite3` as sqlite adapter.

[`v0.0.2-beta.385 (2022-03-18)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.384...v0.0.2-beta.385)

- `@faasjs/ant-design`
  - [Feature] Add `afterItems` to `Form`.

[`v0.0.2-beta.384 (2022-03-03)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.383...v0.0.2-beta.384)

- `@faasjs/ant-design`
  - [Fix] Fix `filterDropdown`.

[`v0.0.2-beta.383 (2022-03-01)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.382...v0.0.2-beta.383)

- `@faasjs/ant-design`
  - [Feature] Update i18n.

[`v0.0.2-beta.382 (2022-02-28)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.380...v0.0.2-beta.382)

- `@faasjs/jest`
  - [Feature] Add new package `@faasjs/jest`.
- `@faasjs/ant-design`
  - [Feature] Add `object` and `object[]` to `FormItem`.

[`v0.0.2-beta.380 (2022-02-25)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.379...v0.0.2-beta.380)

- `@faasjs/server`
  - [Feature] Add default route.

[`v0.0.2-beta.379 (2022-02-24)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.378...v0.0.2-beta.379)

- `@faasjs/server`
  - [Feature] Support tsx file.
- `@faasjs/ant-design`
  - [Fix] Fix submit for `Form`.

[`v0.0.2-beta.378 (2022-02-23)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.375...v0.0.2-beta.378)

- `@faasjs/ant-design`
  - [Feature] Add `beforeItems` to `Form`.
  - [Feature] Support pure string as children.

[`v0.0.2-beta.375 (2022-02-22)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.374...v0.0.2-beta.375)

- `@faasjs/ant-design`
  - [Feature] Add `submitTo` to `Form`.

[`v0.0.2-beta.374 (2022-02-18)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.373...v0.0.2-beta.374)

- `@faasjs/ant-design`
  - [Feature] Add `children` to `Title`.

[`v0.0.2-beta.373 (2022-02-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.371...v0.0.2-beta.373)

- `@faasjs/ant-design`
  - [Fix] Fix antd paths.

[`v0.0.2-beta.371 (2022-02-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.370...v0.0.2-beta.371)

- `@faasjs/ant-design`
  - [Feature] Add `h1` to `Title`.
  - [Feature] Export dayjs components.

[`v0.0.2-beta.370 (2022-02-09)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.365...v0.0.2-beta.370)

- `@faasjs/ant-design`
  - [Feature] Add DatePicker to `FormItem`.

[`v0.0.2-beta.365 (2022-02-07)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.357...v0.0.2-beta.365)

- `@faasjs/graphql-server`
  - [Break] Remove package `@faasjs/graphql-server`.

[`v0.0.2-beta.357 (2022-02-01)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.353...v0.0.2-beta.357)

Happy Chinese New Year! :tiger: :firecracker:

- `@faasjs/browser`
  - [Break] Rename `FaasData` to `FaasDataWrapper`.
  - [Break] Rename `element` to `render`.
  - [Feature] Add `data` and `setData` to `useFaas` and `FaasDataWrapper`.
  - [Feature] Add module to package.json.
  - [Feature] Export `FaasDataWrapper` directly, it will use default client.
- `@faasjs/ant-design`
  - [Feature] `Table` supports ajax mode.

[`v0.0.2-beta.353 (2022-01-30)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.352...v0.0.2-beta.353)

- `@faasjs/ant-design`
  - [Feature] Add `Config`.
  - [Feature] Add `Title`.
  - [Feature] Add `Routes`.

[`v0.0.2-beta.348 (2022-01-29)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.346...v0.0.2-beta.352)

- `@faasjs/http`
  - [Feature] Add regexp rule. (Thanks contributor: [@Germini](https://github.com/Germiniku)).
- `@faasjs/ant-design`
  - [Feature] Add `Drawer` and `useDrawer`.
  - [Feature] Add `data` and `setData` to `FaasDataWrapper`.
- `@faasjs/eslint-config-recommended`
  - [Feature] Add `*.mjs` to files.

[`v0.0.2-beta.346 (2022-01-17)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.345...v0.0.2-beta.346)

- `@faasjs/ant-design`
  - [Feature] Add `options` to `baseItemProps`.
- `@faasjs/knex`
  - [Feature] upgrade to `knex` v1.0.0.
  - [Feature] use `@vscode/sqlite3` instead of `sqlite3`.

[`v0.0.2-beta.345 (2022-01-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.342...v0.0.2-beta.345)

- `@faasjs/ant-design`
  - [Feature] Add `options` to `Description` and `Table`.
  - [Feature] Add `Blank`.
  - [Feature] Add `filter` to `boolean` in `Table`.
- `@faasjs/server`
  - [Feature] use `randomBytes` to generate requestId.
  - [Feature] add `queryString` to event.

[`v0.0.2-beta.342 (2022-01-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.341...v0.0.2-beta.342)

- `@faasjs/ant-design`
  - [Feature] Add `faasData` to `Table` and `Description`.
- `@faasjs/react`
  - [Feature] Add `getClient`.

[`v0.0.2-beta.341 (2022-01-12)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.337...v0.0.2-beta.341)

- `@faasjs/ant-design`
  - [Feature] Add `extend` to `Form`, `Description` and `Table`.

[`v0.0.2-beta.337 (2022-01-11)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.334...v0.0.2-beta.337)

- `@faasjs/ant-design`
  - [Feature] Add `render` to `Description`.
  - [Feature] Add submit options to `Form`.

[`v0.0.2-beta.334 (2022-01-10)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.331...v0.0.2-beta.334)

- [Remove] `@faasjs/logger` remove default export.
- [Remove] `@faasjs/request` remove default export.
- [Remove] `@faasjs/deep_merge` remove default export.

[`v0.0.2-beta.331 (2022-01-05)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.328...v0.0.2-beta.331)

- `@faasjs/ant-design`
  - [Feature] Add `maxCount` to `FormItem`.
  - [Feature] Add `string[]` and `number[]` to `options`.

[`v0.0.2-beta.328 (2022-01-04)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.326...v0.0.2-beta.328)

- [Feature] `@faasjs/ant-design` add `options` as a select to `FormItem`.

[`v0.0.2-beta.326 (2022-01-04)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.324...v0.0.2-beta.326)

- [Feature] Add `@faasjs/ts-transform`.

[`v0.0.2-beta.324 (2021-12-28)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.323...v0.0.2-beta.324)

- [Fix] `@faasjs/browser` fix cookie.

[`v0.0.2-beta.323 (2021-12-27)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.321...v0.0.2-beta.323)

- [Feature] `@faasjs/ant-design` add `input` to `FormItem`.
- [Feature] `@faasjs/ant-design` export `useForm`.

[`v0.0.2-beta.321 (2021-12-26)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.314...v0.0.2-beta.321)

- [Fix] `@faasjs/load` fix node resolve issue.
- [Feature] replace `ts-node` with `swc`.

[`v0.0.2-beta.314 (2021-12-25)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.313...v0.0.2-beta.314)

- [Feature] use `tsup` to build packages.
- [Feature] `@faasjs/test` remove `vm2`.

[`v0.0.2-beta.313 (2021-12-24)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.311...v0.0.2-beta.313)

- [Feature] Add `@faasjs/types` to `faasjs`.
- [Feature] Add `@faasjs/ant-design`.

[`v0.0.2-beta.313 (2021-12-21)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.309...v0.0.2-beta.311)

- [Feature] `@faasjs/graphql-server` upgrade api.
- [Feature] replace `@sucrase/jest-plugin` with `@swc/jest`.

[`v0.0.2-beta.309 (2021-12-18)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.298...v0.0.2-beta.309)

- [Fix] `@faasjs/react` fix types.

[`v0.0.2-beta.298 (2021-12-16)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.295...v0.0.2-beta.298)

- [Fix] `@faasjs/browser` fix `data` and `onError`.

[`v0.0.2-beta.295 (2021-12-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.295...v0.0.2-beta.298)

- [Feature] `@faasjs/browser` replace `XMLHttpRequest` with `fetch`.

[`v0.0.2-beta.295 (2021-12-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.292...v0.0.2-beta.295)

- [Feature] `@faasjs/http` export `ValidatorConfig`.
- [Feature] `@faasjs/react` add `FaasActions`.

[`v0.0.2-beta.292 (2021-12-12)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.285...v0.0.2-beta.292)

- [Feature] `@faasjs/react` add `FaasData`.

[`v0.0.2-beta.285 (2021-12-10)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.280...v0.0.2-beta.285)

- [Feature] `@faasjs/react` 中 `useFaas` 新增导出 `setLoading`、`setPromise`、`setData` 和 `setError` 参数，用于自定义数据加载。

[`v0.0.2-beta.280 (2021-12-07)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.278...v0.0.2-beta.280)

- [Feature] `@faasjs/browser` 中 `beforeRequest` 配置项允许传入异步函数。
- [Feature] `@faasjs/server` 内置 `CORS` 支持。

[`v0.0.2-beta.278 (2021-12-06)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.275...v0.0.2-beta.278)

- [Feature] `@faasjs/server` 优化单体应用模式下的日志输出。
- [Feature] `@faasjs/http` 新增 `http.body` 属性，用于获取原始请求体。
- [Feature] `@faasjs/http` 简化日志输出。

[`v0.0.2-beta.275 (2021-12-05)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.273...v0.0.2-beta.275)

- [Feature] `faasjs` 默认依赖包移除 `@faasjs/tencentcloud`，使用腾讯云的服务须手动添加依赖。
- [Feature] `@faasjs/browser`、`@faasjs/react` 和 `@faasjs/vue-plugin` 编译版本升级到 `es2017`。

[`v0.0.2-beta.273 (2021-12-03)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.271...v0.0.2-beta.273)

- [新增] `@faasjs/aws` 新增 AWS 适配器。

[`v0.0.2-beta.271 (2021-11-29)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.269...v0.0.2-beta.271)

- [Feature] `@faasjs/redis` 使用 `ioredis` 替代 `redis`。
- [Feature] `@faasjs/tencentcloud` 优化重复代码。
- [Feature] `@faasjs/cli` 优化日志提示。
- [修复] `@faasjs/tencentcloud` 修正打包时未将 .d.ts 等文件移除的问题。

[`v0.0.2-beta.269 (2021-11-01)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.268...v0.0.2-beta.269)

- [Feature] `@faasjs/func` 新增代码包启动计时（此时间为冷启动的一部分）。

[`v0.0.2-beta.268 (2021-10-28)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.267...v0.0.2-beta.268)

- [Feature] `@faasjs/eslint-config-recommended` 移除 `eslint-plugin-jest`。

[`v0.0.2-beta.267 (2021-10-25)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.266...v0.0.2-beta.267)

- [Feature] `@faasjs/http` 优化 ts 定义。

[`v0.0.2-beta.266 (2021-10-24)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.263...v0.0.2-beta.266)

- [Feature] 将项目的 ts 编译设置为 `strict` 模式。

[`v0.0.2-beta.263 (2021-10-16)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.260...v0.0.2-beta.263)

- [Feature] `@faasjs/test` 修正 `FuncWarper` 为正确的拼写。

[`v0.0.2-beta.260 (2021-10-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.258...v0.0.2-beta.260)

- [Feature] `@faasjs/func` 优化部分 ts 定义。
- [Feature] `@faasjs/cloud_function` 优化部分 ts 定义。

[`v0.0.2-beta.258 (2021-10-12)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.257...v0.0.2-beta.258)

- [Feature] `@faasjs/http` 对于小于 100 字节的内容不压缩。

[`v0.0.2-beta.257 (2021-10-11)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.256...v0.0.2-beta.257)

- [Feature] `@faasjs/redis` 新增 `getJSON` 和 `setJSON` 方法。
- [Feature] `vscode/faasjs-snippets` 新增 `http validator` 代码块。

[`v0.0.2-beta.256 (2021-10-04)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.254...v0.0.2-beta.256)

- [Feature] 采用 `npm` 替代 `yarn`，并将部分关联依赖改为 `peerDependencies`。

[`v0.0.2-beta.254 (2021-09-26)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.253...v0.0.2-beta.254)

- [移除] `@faasjs/kafka`。
- [修正] `@faasjs/react` 修正加载错误。

[`v0.0.2-beta.253 (2021-09-24)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.251...v0.0.2-beta.253)

- [移除] `@faasjs/sql` 移除，使用 `@faasjs/knex` 代替。
- [Feature] VS Code 插件 `faasjs-snippets` 添加更多代码片段。
- [Feature] `@faasjs/cloud_function` 将 `config` 参数改为 `public`。

[`v0.0.2-beta.251 (2021-09-17)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.244...v0.0.2-beta.251)

- [Feature] `@faasjs/browser` 支持 CDN。
- [Feature] `@faasjs/react` 支持 CDN。
- [Feature] `@faasjs/vue-plugin` 支持 CDN。

[`v0.0.2-beta.244 (2021-09-16)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.243...v0.0.2-beta.244)

- [Feature] `@faasjs/deep_merge` 导出 `deepMerge` 方法。
- [Feature] `@faasjs/logger` 导出 `Logger` 类。

[`v0.0.2-beta.243 (2021-09-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.241...v0.0.2-beta.243)

- [Feature] `@faasjs/tencentcloud` 将本地 mock 功能移到 `@faasjs/cloud_function`。

[`v0.0.2-beta.241 (2021-09-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.240...v0.0.2-beta.241)

- [修正] `@faasjs/tencentcloud` 环境变量不再强制覆盖 region。

[`v0.0.2-beta.240 (2021-09-11)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.238...v0.0.2-beta.240)

- [Feature] `@faasjs/react` 新增 `reload` 方法。

[`v0.0.2-beta.238 (2021-09-07)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.237...v0.0.2-beta.238)

- [Feature] `@faasjs/func` 添加 `filename` 属性。

[`v0.0.2-beta.237 (2021-09-05)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.234...v0.0.2-beta.237)

- [Feature] `@faasjs/tencentcloud` 优化并导出 `request` 方法。

[`v0.0.2-beta.234 (2021-09-03)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.232...v0.0.2-beta.234)

- [Feature] `@faasjs/redis` 导出 `get` 和 `set` 方法。

[`v0.0.2-beta.232 (2021-09-01)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.231...v0.0.2-beta.232)

- [修正] `@faasjs/cli` 修正部署时内存泄露的问题。

[`v0.0.2-beta.232 (2021-08-30)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.231...v0.0.2-beta.232)

- [修正] `@faasjs/tencentcloud` 修正日志输出。

[`v0.0.2-beta.231 (2021-08-29)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.230...v0.0.2-beta.231)

- [修正] `@faasjs/http` 修正 `HttpError` 的问题。

[`v0.0.2-beta.230 (2021-08-27)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.220...v0.0.2-beta.230)

- [Feature] 常用函数通过 export 直接导出。

[`v0.0.2-beta.220 (2021-07-30)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.219...v0.0.2-beta.220)

- [修正] `@faasjs/tencentcloud` 使用最新的环境变量。

[`v0.0.2-beta.219 (2021-07-28)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.218...v0.0.2-beta.219)

- [Feature] `@faasjs/cloud_function` 优化 invoke 数据。

[`v0.0.2-beta.218 (2021-07-26)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.216...v0.0.2-beta.218)

- [Feature] `@faasjs/eslint-config-recommended` 优化代码风格规范。
- [Feature] `@faasjs/mongo` 支持 `mongodb` 新版本。

[`v0.0.2-beta.216 (2021-07-26)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.215...v0.0.2-beta.216)

- [Feature] `@faasjs/tencentcloud` 优化时间签名。

[`v0.0.2-beta.215 (2021-07-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.214...v0.0.2-beta.215)

- [Feature] `@faasjs/graphql-server` 支持 `apollo-server-core` 新版本。

[`v0.0.2-beta.214 (2021-07-12)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.212...v0.0.2-beta.214)

- [Feature] `@faasjs/eslint-config-recommended` 优化代码风格规范。

[`v0.0.2-beta.212 (2021-07-10)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.209...v0.0.2-beta.212)

- [Feature] `@faasjs/cli` 部署命令如果使用 `-c` 参数，默认读取最近的 commit 日志。
- [Feature] `@faasjs/tencentcloud` 优化日志。
- [删除] 删除 `@faasjs/nuxt` 插件。

[`v0.0.2-beta.209 (2021-07-02)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.207...v0.0.2-beta.209)

- [Feature] `@faasjs/server` 退出时自动关闭连接。

[`v0.0.2-beta.207 (2021-07-01)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.204...v0.0.2-beta.207)

- [Feature] `@faasjs/load` 使用 `@rollup/plugin-typescript` 替代 rpt2。

[`v0.0.2-beta.204 (2021-06-29)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.201...v0.0.2-beta.204)

- [Feature] `@faasjs/cli` 新增 `commit` 参数，批量部署被修改的云函数。

[`v0.0.2-beta.201 (2021-06-28)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.198...v0.0.2-beta.201)

- [Feature] `@faasjs/tencentcloud` 优化腾讯云接口。
- [Feature] `@faasjs/tencentcloud` 配置优先级调整为：环境变量 > 代码配置项 > yaml 配置项。

[`v0.0.2-beta.198 (2021-06-23)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.197...v0.0.2-beta.198)

- [Feature] `@faasjs/cli` 提速 ts-node，编译时不检查 ts 定义。

[`v0.0.2-beta.197 (2021-06-21)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.193...v0.0.2-beta.197)

- [Feature] `@faasjs/http` 优化 ts 定义。

[`v0.0.2-beta.193 (2021-06-20)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.191...v0.0.2-beta.193)

- [Feature] `@faasjs/http` 优化 ts 定义。

[`v0.0.2-beta.191 (2021-06-18)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.188...v0.0.2-beta.191)

- [Feature] `@faasjs/test` 使用 vm2 加载测试云函数。

[`v0.0.2-beta.188 (2021-06-17)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.185...v0.0.2-beta.188)

- [Feature] `@faasjs/cli` 仅在启动 server 时引入 ts-node。
- [修复] `@faasjs/cli` 修正部署大量云函数时内存泄露的问题。
- [Feature] 示例新增 `jwt` 项目示例。

[`v0.0.2-beta.185 (2021-06-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.179...v0.0.2-beta.185)

- [Feature] `@faasjs/browser` 新增 `beforeRequest` 参数。
- [修复] `@faasjs/cli` 修复部分入参无效的问题。

[`v0.0.2-beta.179 (2021-06-12)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.178...v0.0.2-beta.179)

- [Feature] `@faasjs/http` 优化 `beforeValid`。

[`v0.0.2-beta.178 (2021-06-08)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.175...v0.0.2-beta.178)

- [移除] 为了简化和统一数据库读写，移除 `@faasjs/typeorm` 和 `@faasjs/sequelize`。
- [Feature] `@faasjs/http` 新增 `beforeValid`，用于构建包含自定义请求校验的 http 插件。

[`v0.0.2-beta.175 (2021-05-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.174...v0.0.2-beta.175)

- [Feature] `@faasjs/knex` 优化 transaction 的 ts 定义。

[`v0.0.2-beta.174 (2021-05-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.170...v0.0.2-beta.174)

- [Feature] `@faasjs/cli` 部署时对文件名进行检查。
- [Feature] `@faasjs/cli` 部署命令添加 `ar` 参数，默认自动重试 3 次。
- [Feature] `@faasjs/knex` 部署时检查适配器依赖项是否添加。
- [修复] `@faasjs/tencentcloud` 修复部分情况下依赖项错误的问题。

[`v0.0.2-beta.170 (2021-04-23)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.169...v0.0.2-beta.170)

- [修复] `@faasjs/cloud_function` 修复插件排序错误的问题。
- [修复] `@faasjs/cloud_function` 修复插件名字错误的问题。

[`v0.0.2-beta.169 (2021-04-22)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.167...v0.0.2-beta.169)

- [Feature] `@faasjs/cli` 部署失败时，优化错误提示。
- [Feature] `@faasjs/cli` 新增 -w 参数，设置并发数。

[`v0.0.2-beta.167 (2021-04-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.163...v0.0.2-beta.167)

- [Feature] `@faasjs/cli` 部署多个云函数时，自动根据 CPU 数量进行多进程部署。
- [Feature] `@faasjs/tencentcloud` 优化多进程部署时的日志显示。
- [Feature] `@faasjs/http` 测试环境下禁用缓存。

[`v0.0.2-beta.163 (2021-04-16)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.162...v0.0.2-beta.163)

- [Feature] `@faasjs/cloud_function` 和 `@faasjs/browser` action 自动转小写。

[`v0.0.2-beta.162 (2021-04-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.161...v0.0.2-beta.162)

- [Feature] `@faasjs/cli` 支持部署失败时重试。

[`v0.0.2-beta.161 (2021-04-12)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.160...v0.0.2-beta.161)

- [Feature] `@faasjs/request` 新增 parse 配置项。

[`v0.0.2-beta.160 (2021-04-08)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.158...v0.0.2-beta.160)

- [Feature] `@faasjs/knex` 优化 knex 的 ts 定义。
- [Feature] `@faasjs/graphql` 优化 graphql 依赖项。

[`v0.0.2-beta.158 (2021-04-01)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.155...v0.0.2-beta.158)

- [修复] `@faasjs/tencentcloud` 修复云函数插件某些情况下未加载的问题。

[`v0.0.2-beta.155 (2021-02-04)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.153...v0.0.2-beta.155)

- [新增] `@faasjs/eslint-config-react`。

[`v0.0.2-beta.153 (2021-02-04)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.151...v0.0.2-beta.153)

- [修复] `@faasjs/cli` 修复日志等级错误的问题。

[`v0.0.2-beta.151 (2021-01-26)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.144...v0.0.2-beta.151)

- [Feature] `@faasjs/tencentcloud` 优化打包机制。

[`v0.0.2-beta.144 (2021-01-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.140...v0.0.2-beta.144)

- [Feature] `@faasjs/tencentcloud` 更新网关发布接口。

[`v0.0.2-beta.140 (2021-01-07)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.135...v0.0.2-beta.140)

- [Feature] `@faasjs/load` 升级 js-yaml 版本。
- [Feature] `@faasjs/load` 更新内置库。
- [Feature] `@faasjs/typeorm` 支持 `useTypeORM`。

[`v0.0.2-beta.135 (2020-12-25)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.131...v0.0.2-beta.135)

- [Feature] `@faasjs/cloud_function` 优化日志输出。

[`v0.0.2-beta.131 (2020-12-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.126...v0.0.2-beta.131)

- [Feature] `@faasjs/create-faas-app` 优化命令行。

[`v0.0.2-beta.126 (2020-12-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.125...v0.0.2-beta.126)

- [修复] `@faasjs/knex` 修复 raw 的 ts 定义。

[`v0.0.2-beta.125 (2020-12-10)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.124...v0.0.2-beta.125)

- [Feature] `@faasjs/eslint-config-vue` 优化规则。
- [Feature] `@faasjs/http` 优化 ts 定义。

[`v0.0.2-beta.124 (2020-12-04)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.122...v0.0.2-beta.124)

- [Feature] `@faasjs/cloud_function` config 支持传入一个 function。

[`v0.0.2-beta.122 (2020-11-30)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.121...v0.0.2-beta.122)

- [Feature] `@faasjs/eslint-config-vue` 优化规则。

[`v0.0.2-beta.121 (2020-11-21)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.119...v0.0.2-beta.121)

- [修复] `@faasjs/load` 修复重复引用文件的问题。
- [Feature] `@faasjs/request` debug 模式下显示更详细的日志。

[`v0.0.2-beta.119 (2020-11-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.118...v0.0.2-beta.119)

- [新增] 新增 `@faasjs/kafka`。

[`v0.0.2-beta.118 (2020-11-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.117...v0.0.2-beta.118)

- [修复] `@faasjs/knex` 修复 knex 连接。

[`v0.0.2-beta.117 (2020-11-12)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.116...v0.0.2-beta.117)

- [修复] `@faasjs/test` 补充 headers 的 ts 定义。
- [Feature] `@faasjs/logger` 优化插件的日志显示。

[`v0.0.2-beta.116 (2020-10-30)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.115...v0.0.2-beta.116)

- [修复] `@faasjs/cloud_function` 修复本地调试时没 context 时的报错。

[`v0.0.2-beta.115 (2020-10-28)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.114...v0.0.2-beta.115)

- [Feature] `@faasjs/react` 新增返回 `promise` 对象。

[`v0.0.2-beta.114 (2020-10-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.112...v0.0.2-beta.114)

- [Feature] `@faasjs/http` 压缩后添加 originBody 以便日志查看。
- [Feature] `@faasjs/cloud_function` 移除 context 中的 function 等无法序列化的内容。

[`v0.0.2-beta.112 (2020-10-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.107...v0.0.2-beta.112)

- [Feature] `@faasjs/http` 默认使用 brotli 压缩。
- [修复] `@faasjs/http` 修复没有 body 时也压缩的 bug。

[`v0.0.2-beta.107 (2020-10-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.106...v0.0.2-beta.107)

- [Feature] `@faasjs/http` 支持 gzip 压缩。
- [删除] 禁用并删除 `@faasjs/cos-secrets`，请使用 CFS 替代。

[`v0.0.2-beta.106 (2020-09-30)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.105...v0.0.2-beta.106)

- [Feature] 优化 ts 定义。

[`v0.0.2-beta.105 (2020-09-16)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.104...v0.0.2-beta.105)

- [Feature] `@faasjs/request`优化日志。

[`v0.0.2-beta.104 (2020-09-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.101...v0.0.2-beta.104)

- [Feature] `@faasjs/request` 新增 pfx 和 passphrase 配置项。

[`v0.0.2-beta.101 (2020-09-09)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.100...v0.0.2-beta.101)

- [修复] 修复日志 bug。

[`v0.0.2-beta.100 (2020-09-07)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.96...v0.0.2-beta.100)

- [修复] 修复函数式编程接口的 bug。

[`v0.0.2-beta.96 (2020-08-28)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.95...v0.0.2-beta.96)

- [Feature] `@faasjs/tencentcloud` 更新云函数配置项。

[`v0.0.2-beta.95 (2020-08-21)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.94...v0.0.2-beta.95)

- [Feature] `@faasjs/react` 新增 `onError` 配置项。

[`v0.0.2-beta.94 (2020-08-11)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.93...v0.0.2-beta.94)

- [Feature] 更新 ts 定义。

[`v0.0.2-beta.93 (2020-08-07)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.88...v0.0.2-beta.93)

- [修复] `@faasjs/server` 多个请求时排队处理。

[`v0.0.2-beta.88 (2020-08-06)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.87...v0.0.2-beta.88)

- [Feature] 优化 ts 定义及相关测试用例。

[`v0.0.2-beta.87 (2020-08-03)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.86...v0.0.2-beta.87)

- [Feature] 优化日志输出格式。

[`v0.0.2-beta.86 (2020-08-02)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.85...v0.0.2-beta.86)

- [Feature] `@faasjs/redis` 支持 `useRedis`。

[`v0.0.2-beta.85 (2020-07-31)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.84...v0.0.2-beta.85)

- [新增] `@faasjs/knex`。
- [Feature] 优化 useFunc 及 usePlugin。

[`v0.0.2-beta.84 (2020-07-27)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.82...v0.0.2-beta.84)

- [Feature] `@faasjs/tencentcloud` 更新云API v3。

[`v0.0.2-beta.82 (2020-07-16)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.80...v0.0.2-beta.82)

- [Feature] `@faasjs/tencentcloud` 优化触发器更新机制。

[`v0.0.2-beta.80 (2020-07-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.79...v0.0.2-beta.80)

- [新增] 新增 `@faasjs/react`，提供 `faas` 和 `useFaas` 两种风格的接口。

[`v0.0.2-beta.79 (2020-07-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.78...v0.0.2-beta.79)

- [修复] `@faasjs/server` 修复没有响应内容时的报错。

[`v0.0.2-beta.78 (2020-07-09)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.77...v0.0.2-beta.78)

- [修复] `create-faas-app` 删除旧的 babel 配置，改成 ts-jest。
- [修复] 修复示例项目的 package.json。
- [Feature] `@faasjs/func` 优化 ts 支持。
- [修复] `@faasjs/server` 修正没有响应内容时的出错。

[`v0.0.2-beta.77 (2020-06-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.76...v0.0.2-beta.77)

- [Feature] `@faasjs/server` 优化无缓存情况下的热加载。

[`v0.0.2-beta.76 (2020-06-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.70...v0.0.2-beta.76)

- [Feature] `@faasjs/server` 优化无缓存情况下的热加载。
- [Feature] `@faasjs/tencentcloud` 将 Node.js 默认版本升级到 12.16。
- [Feature] `@faasjs/func` 优化 ts 支持。

[`v0.0.2-beta.70 (2020-06-10)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.69...v0.0.2-beta.70)

- [Feature] `@faasjs/server` 优化缓存。

[`v0.0.2-beta.69 (2020-06-03)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.67...v0.0.2-beta.69)

- [Feature] `@faasjs/logger` 云函数环境下,删除日志中的换行符。

[`v0.0.2-beta.67 (2020-06-02)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.66...v0.0.2-beta.67)

- [Feature] `@faasjs/func` 优化日志显示和 ts 类型。

[`v0.0.2-beta.66 (2020-05-28)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.65...v0.0.2-beta.66)

- [Feature] `@faasjs/test` 支持直接测试云函数，而非云函数文件。

[`v0.0.2-beta.65 (2020-05-26)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.64...v0.0.2-beta.65)

- [Feature] `@faasjs/eslint-config-recommended` 优化规则。

[`v0.0.2-beta.64 (2020-05-25)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.63...v0.0.2-beta.64)

- [Feature] `@faasjs/test` 中 `mount` 方法支持传入一个初始化后执行的函数。

[`v0.0.2-beta.63 (2020-05-18)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.61...v0.0.2-beta.63)

- [Feature] `@faasjs/test` 新增 `mount` 方法，`JSONHandler` 方法支持 cookie 和 session 入参。

[`v0.0.2-beta.61 (2020-05-17)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.59...v0.0.2-beta.61)

- [Feature] `@faasjs/cos-secrets` 支持密钥文件。
- [Feature] `@faasjs/tencentcloud` 禁用腾讯云内置的旧版 `request`。

[`v0.0.2-beta.59 (2020-05-06)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.57...v0.0.2-beta.59)

- [修复] `@faasjs/func` 强制设定 `context.callbackWaitsForEmptyEventLoop = false`。
- [Feature] `@faasjs/tencentcloud` 禁用腾讯云内置的旧版 `tencentcloud-sdk-nodejs`。

[`v0.0.2-beta.57 (2020-04-22)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.55...v0.0.2-beta.57)

- [Feature] `@faasjs/tencentcloud` 升级默认 Node.js 版本为 `10.15`。
- [修复] `@faasjs/tencentcloud` 修正腾讯云新错误代码导致无法发布的问题。

[`v0.0.2-beta.55 (2020-04-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.54...v0.0.2-beta.55)

- [Feature] `@faasjs/eslint-config-vue` 移除 `plugin:security/recommended`。

[`v0.0.2-beta.54 (2020-04-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.53...v0.0.2-beta.54)

- [Feature] `@faasjs/cli` 适配 Windows 环境。

[`v0.0.2-beta.53 (2020-04-12)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.52...v0.0.2-beta.53)

- [Feature] `@faasjs/server` 添加 sourceIp。

[`v0.0.2-beta.52 (2020-04-10)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.51...v0.0.2-beta.52)

- [Feature] `@faasjs/server` 优化日志展示。
- [Feature] `@faasjs/tencentcloud` 优化依赖库打包机制。

[`v0.0.2-beta.51 (2020-04-09)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.47...v0.0.2-beta.51)

- [Feature] `@faasjs/http` 添加 HTTP 方法定义。
- [Feature] `@faasjs/load` 优化打包时排除内置库的逻辑。
- [新增] 新增 `@faasjs/sequelize`。
- [Feature] `@faasjs/http`、`@faasjs/server` 新增 header `X-SCF-RequestId`。

[`v0.0.2-beta.47 (2020-04-02)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.46...v0.0.2-beta.47)

- [Feature] `@faasjs/cloud_function` 在云函数环境中使用内网域名提升性能。

[`v0.0.2-beta.46 (2020-03-26)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.40...v0.0.2-beta.46)

- [Feature] `faasjs` 移除依赖项：@faasjs/browser, @faasjs/sql, @faasjs/redis。
- [新增] `@faasjs/mongo` 用于适配 mongodb。
- [Feature] 优化了云函数的日志输出。

[`v0.0.2-beta.40 (2020-03-20)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.34...v0.0.2-beta.40)

- [Feature] `@faasjs/http` 配置项新增 `path` 和 `ignorePathPrefix` 设置。

[`v0.0.2-beta.34 (2020-03-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.32...v0.0.2-beta.34)

- [修复] `@faasjs/cli` 修复当 tsconfig 中未使用 paths 功能时出错的问题。
- [Feature] `@faasjs/typeorm` 新增 `Connection, Repository, SelectQueryBuilder, getRepository` 的输出。

[`v0.0.2-beta.32 (2020-03-09)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.29...v0.0.2-beta.32)

- [Feature] `@faasjs/cli` 支持 tsconfig 的 paths 功能。
- [修复] `@faasjs/typeorm` 修复单体应用模式下连接出错的问题

[`v0.0.2-beta.29 (2020-03-03)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.28...v0.0.2-beta.29)

- [修复] `@faasjs/cos-secrets` 修复嵌套全局变量名错误的问题。

[`v0.0.2-beta.28 (2020-03-02)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.26...v0.0.2-beta.28)

- [Feature] `@faasjs/eslint-config-recommended` 补充空格相关的样式设定。
- [Feature] `@faasjs/cos-secrets` 本地模式下会读取本地文件。
- [Feature] `@faasjs/sql` 支持从环境变量读取配置信息。
- [Feature] `@faasjs/typeorm` 支持从环境变量读取配置信息。
- [Feature] `@faasjs/redis` 支持从环境变量读取配置信息。
- [Feature] `@faasjs/server` 出错信息以 json 格式返回。

[`v0.0.2-beta.26 (2020-03-01)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.25...v0.0.2-beta.26)

- [新增] `@faasjs/cos-secrets`，一个基于 COS 的密钥解决方案。
- [Feature] 将文档移入 `docs` 文件夹。
- [Feature] 将示例移入 `examples` 文件夹。

[`v0.0.2-beta.25 (2020-02-27)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.24...v0.0.2-beta.25)

- [Feature] `@faasjs/tencentcloud` 腾讯云故障，禁用别名功能。

[`v0.0.2-beta.24 (2020-02-25)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.22...v0.0.2-beta.24)

- [Feature] `@faasjs/graphql-server` 允许 `schemas` 参数为函数，且支持异步函数。
- [Feature] `@faasjs/graphql-server` 导出变量新增 `GraphQLSchemaModule`。

[`v0.0.2-beta.22 (2020-02-24)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.20...v0.0.2-beta.22)

- [修复] `@faasjs/typeorm` 修复配置项错误。
- [修复] `@faasjs/tencentcloud` 修复部署时打包依赖项的错误。

[`v0.0.2-beta.20 (2020-02-23)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.18...v0.0.2-beta.20)

- [新增] 新增 `@faasjs/typeorm`。
- [Feature] `@faasjs/sql` 单元测试新增 mysql 和 postgresql 的测试。

[`v0.0.2-beta.18 (2020-02-22)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.16...v0.0.2-beta.18)

- [Feature] `@faasjs/tencentcloud` 云函数新增层和死信队列接口，COS 增加文件夹名。
- [Feature] `@faasjs/load` 关闭 rollup 的警告信息。

[`v0.0.2-beta.16 (2020-02-21)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.13...v0.0.2-beta.16)

- [Feature] `@faasjs/graphql-server` 内置 `@faasjs/http`。
- [Feature] `@faasjs/tencentcloud` 云函数环境变量新增 `FaasLog=debug`。

[`v0.0.2-beta.13 (2020-02-20)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.10...v0.0.2-beta.13)

- [Feature] `@faasjs/tencentcloud` 新增单元测试。
- [Feature] `@faasjs/request` 新增 `file` 和 `downloadStream` 参数。
- [Feature] `@faasjs/graphql-server` 规范化配置项，并将 `invokeData` 作为 context。

[`v0.0.2-beta.10 (2020-02-16)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.9...v0.0.2-beta.10)

- [Feature] `@faasjs/eslint-config-recommended` 更新 eslint rules。

[`v0.0.2-beta.9 (2020-02-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.8...v0.0.2-beta.9)

- [Feature] 恢复腾讯云的别名功能。
- [Feature] 修复和优化 travis-ci。

[`v0.0.2-beta.8 (2020-02-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.7...v0.0.2-beta.8)

- [Feature] `faasjs` 不再内置 `@faasjs/graphql-server`，需手动添加使用。

[`v0.0.2-beta.7 (2020-02-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.5...v0.0.2-beta.7)

- [修复] `@faasjs/load` 修复打包时遇到内置模块报错的问题。
- [Feature] `@faasjs/eslint-config-recommended` 更新 eslint rules。

[`v0.0.2-beta.5 (2020-02-10)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.4...v0.0.2-beta.5)

- [Feature] `@faasjs/test` 将 `jest` 添加为依赖项。

[`v0.0.2-beta.4 (2020-02-09)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.2...v0.0.2-beta.4)

- [Feature] `@faasjs/func` handler 参数改为可选项。
- [新增] `@faasjs/graphql-server` 试验性支持 graphQL。

[`v0.0.2-beta.2 (2020-02-08)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.1...v0.0.2-beta.2)

- [Feature] `@faasjs/tencentcloud` 优化了部署云函数时的日志输出。

[`v0.0.2-beta.1 (2020-02-07)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.31...v0.0.2-beta.1)

- [Feature] `@faasjs/tencentcloud` 补全已正式发布的云函数配置项。

[`v0.0.1-beta.31 (2020-02-06)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.29...v0.0.1-beta.31)

- [Feature] `faasjs` 将 Sql 适配包从 `faasjs` 中移除。
- [Feature] `@faasjs/eslint-config-recommended` 更新 eslint rules。

[`v0.0.1-beta.29 (2020-02-04)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.27...v0.0.1-beta.29)

- [修复] `@faasjs/tencentcloud` 修复由于禁用别名功能造成的 BUG。

[`v0.0.1-beta.27 (2020-02-03)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.25...v0.0.1-beta.27)

- [Feature] `@faasjs/tencentcloud` 由于腾讯云故障，暂时禁用别名功能。

[`v0.0.1-beta.25 (2020-02-02)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.23...v0.0.1-beta.25)

- [修复] `@faasjs/tencentcloud` 修复腾讯云部署 BUG。
- [Feature] `@faasjs/tencentcloud` 腾讯云云函数内存默认从 128 降低为 64。
- [Feature] `@faasjs/tencentcloud` 默认环境变量新增 NODE_ENV，值为部署环境的名字。

[`v0.0.1-beta.23 (2020-02-01)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.21...v0.0.1-beta.23)

- [修复] 修复错误的版本号。
- [Feature] `@faasjs/load` 移除 loadNpmVersion。

[`v0.0.1-beta.21 (2020-01-27)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.20...v0.0.1-beta.21)

- [修复] `@faasjs/tencentcloud` API 网关 BUG。
- [Feature] `@faasjs/func` 云函数支持 callback。

[`v0.0.1-beta.20 (2020-01-26)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.18...v0.0.1-beta.20)

- [修复] `@faasjs/tencentcloud` API 网关 BUG。
- [Feature] `@faasjs/tencentcloud` 提升打包速度。

[`v0.0.1-beta.18 (2020-01-25)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.16...v0.0.1-beta.18)

- [修复] `@faasjs/tencentcloud` 修复云函数命名错误。
- [Feature] `@faasjs/server` 本地请求入参 method 改名为 httpMethod，增加 path 参数。

[`v0.0.1-beta.16 (2020-01-13)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.14...v0.0.1-beta.16)

- [修复] `@faasjs/load` 修复 rollup 配置。
- [修复] 修复 FaasJS 项目自动化测试配置。

[`v0.0.1-beta.14 (2020-01-04)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.12...v0.0.1-beta.14)

- [Feature] `@faasjs/http` 移除无用的依赖项。
- [Feature] `@faasjs/tencentcloud` 优化打包配置。

[`v0.0.1-beta.12 (2020-01-02)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.11...v0.0.1-beta.12)

- [修复] 在 `faasjs` 中补上依赖项 `@faasjs/http`。

[`v0.0.1-beta.11 (2020-01-01)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.10...v0.0.1-beta.11)

- [Feature] 优化 FaasJS 项目打包配置。

[`v0.0.1-beta.10 (2019-12-30)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.8...v0.0.1-beta.10)

- [Feature] 优化 FaasJS 项目的代码规范测试和自动化测试。
- [修复] `@faasjs/tencentcloud` 修复云函数部署时未完成部署就删除了 COS 代码包的问题。

[`v0.0.1-beta.8 (2019-12-26)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.7...v0.0.1-beta.8)

- [Feature] 更新 VS Code 配置项以适应新版 ESlint。
- [Feature] `@faasjs/tencentcloud` 更新云函数时会等待其更新生效后才进行后续步骤。
- [Feature] `@faasjs/tencentcloud` 使用本地 node_modules 文件加速部署。

[`v0.0.1-beta.7 (2019-11-05)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.6...v0.0.1-beta.7)

- [Feature] `@faasjs/logger` 性能优化，并移除测试用的 lastOuput 属性。
- [Feature] `@faasjs/server` 移除 response 的日志输出以优化性能。
- [Feature] `@faasjs/http` 直接使用 request_id 作为响应头 X-Request-Id 的值。
- [修复] `@faasjs/http` 使用 = 作为路径前缀避免模糊匹配。
- [删除] 移除周刊。

[`v0.0.1-beta.6 (2019-10-25)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.5...v0.0.1-beta.6)

- [修复] `@faasjs/logger` timeEnd 出错时的错误信息从 error 降级为 warn。

[`v0.0.1-beta.5 (2019-10-25)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.4...v0.0.1-beta.5)

- [Feature] 新增性能测试用例。
- [修复] `@faasjs/logger` timeEnd 的 key 重复或未知时，报错信息从 error 降级为 warn。

[`v0.0.1-beta.4 (2019-10-22)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.2...v0.0.1-beta.4)

- [新增] `@faasjs/http` cookie 新增 `sameSite` 选项。
- [Feature] FaasJS 项目新增代码测试覆盖率。

`2019-10-21`

- [Feature] 使用 lerna 管理 FaasJS 核心库。
- [Feature] `@faasjs/request` 新增 timeout 和 auth 选项。
- [修复] 修正 `@faasjs/http` 遇到返回值为 null 时的错误。

`2019-10-16`

- [新增] 示例项目新增 [knex](https://github.com/faasjs/examples/tree/main/knex)。

`2019-10-15`

- [Feature] 将 FaasJS 所有库都并入了 [faasjs/faasjs](https://github.com/faasjs/faasjs/tree/main/packages) 项目中，便于统一管理和更新。

`2019-10-13`

- [新增] FaasJS 周刊 开始试运行。

`2019-10-11`

- [Feature] 教程中添加新加入的命令行指令。
- [新增] 官网新增 [支持 FaasJS](https://faasjs.com/CONTRIBUTING.html)。
- [修复] `@faasjs/func` 当 handler 没有返回时出现的一个判断异常。

`2019-10-09`

- [新增] 命令行工具新增 `yarn new func` 指令，用于快速创建云函数文件及其测试脚本，具体用法可见 `yarn new -h`。
- [Feature] `create-faas-app` 创建的项目中加入 `.vscode/settings.json` 文件，用于优化 VS Code 下的编程体验。

`2019-10-08`

- [新增] 命令行工具 `create-faas-app` 用于快速创建 FaasJS 项目，可直接通过 `npx create-faas-app` 使用。

`2019-09-30`

- [发布] 结束 `Alpha` 阶段，开始 `Beta` 公测阶段。

## Alpha

`2019-04-13`

- [发布] FaasJS `Alpha` 阶段开发开始。
