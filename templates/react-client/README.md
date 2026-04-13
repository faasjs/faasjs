# React Client Routing

Use `@faasjs/react` in a Vite + React app, auto-discover pages under `src/pages`, and load each page on the client without extra routing glue code.

在 Vite + React 项目中使用 `@faasjs/react`、自动发现 `src/pages` 页面，并在不增加额外路由胶水代码的前提下完成客户端页面加载。

## What you learn / 你将学到

- How to initialize `FaasReactClient`.
- How to auto-discover `index.tsx` and `default.tsx` pages with `@faasjs/react/routing`.
- How to derive page state directly from the current browser URL.
- How to call an API action from React UI.
- How to mock API calls in unit tests with `setMock`.
- How to reuse the built-in `client-entry` plus a tiny `server.ts` for SPA fallback and API routes.

- 如何初始化 `FaasReactClient`。
- 如何通过 `@faasjs/react/routing` 自动发现 `index.tsx` 与 `default.tsx` 页面。
- 如何直接从当前浏览器 URL 推导页面状态。
- 如何在 React UI 中调用 API action。
- 如何通过 `setMock` 编写客户端单测。
- 如何复用内置 `client-entry`，再配合一个很小的 `server.ts` 处理 SPA fallback 与 API 路由。

## Run / 运行

```bash
vp install
vp test
vp dev
```

`vp dev` starts the Vite client dev server and keeps FaasJS API requests available through the shared dev middleware.

`vp dev` 会启动 Vite 客户端开发服务器，并通过共享的开发中间件让 FaasJS API 请求继续可用。

`vp build` emits the client bundle only.

`vp build` 只会产出客户端 bundle。

Build and run the production server:

构建并启动生产服务器：

```bash
vp run start
```

`vp run start` builds the client bundle, then starts `server.ts` to serve `dist/` with an `index.html` fallback plus FaasJS API routes.

`vp run start` 会先构建客户端产物，然后启动 `server.ts`，以 `index.html` fallback 的方式提供 `dist/`，并同时处理 FaasJS API 路由。

The template reuses the framework-provided `@faasjs/react/routing/client-entry`, so there is no local `src/main.tsx`; only the small `server.ts` remains for production hosting.

这个模板直接复用框架提供的 `@faasjs/react/routing/client-entry`，因此不需要本地 `src/main.tsx`；只保留一个很小的 `server.ts` 负责生产环境托管。

If port `3000` is already in use, override it:

如果 `3000` 端口已被占用，可以这样覆盖：

```bash
PORT=3300 vp run start
```

Then visit:

- `/`
- `/?name=React`
- `/docs/react/routing`
- `/missing`
