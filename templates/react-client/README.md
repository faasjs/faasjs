# React SSR

Use `@faasjs/react` in a Vite + React app, auto-discover pages under `src/pages`, and render them on the server without extra dependencies or local entry glue code.

在 Vite + React 项目中使用 `@faasjs/react`、自动发现 `src/pages` 页面，并在不增加额外依赖或本地路由胶水代码的前提下实现服务端渲染。

## What you learn / 你将学到

- How to initialize `FaasReactClient`.
- How to auto-discover `index.tsx` and `default.tsx` pages with `@faasjs/react/routing`.
- How to use a page-level `loader` for SSR props.
- How to call an API action from hydrated React UI.
- How to mock API calls in unit tests with `setMock`.
- How to rely on built-in `@faasjs/react/routing` entry modules so `src/` mostly contains business code and tests.

- 如何初始化 `FaasReactClient`。
- 如何通过 `@faasjs/react/routing` 自动发现 `index.tsx` 与 `default.tsx` 页面。
- 如何通过页面级 `loader` 提供 SSR props。
- 如何在 hydration 后的 React UI 中调用 API action。
- 如何通过 `setMock` 编写客户端单测。
- 如何直接复用 `@faasjs/react/routing` 内置入口，让 `src/` 基本只保留业务代码与测试。

## Run / 运行

```bash
vp install
vp test
vp dev
```

`vp dev` starts the normal Vite client dev server.

`vp dev` 会启动普通的 Vite 客户端开发服务器。

`vp build` now reads the SSR build directly from `vite.config.ts` through `createReactRoutingViteConfig()`, so no extra SSR build command is needed in `package.json`.

`vp build` 现在会通过 `vite.config.ts` 里的 `createReactRoutingViteConfig()` 直接完成 SSR 构建，因此 `package.json` 里不再需要额外拼接一个 SSR build 命令。

Build and run the SSR server:

构建并启动 SSR 服务：

```bash
vp run start
```

`vp run start` builds the client and SSR bundles before starting the production server.

`vp run start` 会先构建客户端与 SSR 产物，再启动生产服务。

The template uses framework-provided client, SSR, and server entry modules from `@faasjs/react/routing`, so there is no local `src/main.tsx`, `src/entry-server.tsx`, or `server.ts` to maintain.

这个模板直接使用 `@faasjs/react/routing` 提供的客户端、SSR 和服务端入口，因此不需要再维护本地的 `src/main.tsx`、`src/entry-server.tsx` 或 `server.ts`。

If port `3000` is already in use, override it:

如果 `3000` 端口已被占用，可以这样覆盖：

```bash
PORT=3300 vp run start
```

Then visit:

- `/`
- `/?name=React`
- `/docs/react/ssr`
- `/missing`
