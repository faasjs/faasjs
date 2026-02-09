# @faasjs/server

本地 HTTP 服务器模块，用于把 `.func.ts` 云函数暴露为 HTTP 接口。

## 安装

```bash
npm install @faasjs/server
```

## 基本用法

```ts
import { Server } from '@faasjs/server'

const server = new Server(process.cwd(), {
  port: 3000,
})

server.listen()
```

## 路由规则

- `/` -> `index.func.ts`
- `/path` -> `path.func.ts` 或 `path/index.func.ts`
- `/*` -> `default.func.ts`
- `/path/*` -> `path/default.func.ts`

## SPA + API 零映射约定（推荐）

为降低前后端一体化项目的理解成本，推荐在 `src/pages` 下按以下方式组织：

- 页面文件：`src/pages/<page>/index.tsx`
- 接口文件：`src/pages/<page>/api/*.func.ts`
- 子功能接口：`src/pages/<page>/<feature>/api/*.func.ts`

对应规则是“文件即路由”：

- `src/pages/todo/api/list.func.ts` -> `POST /todo/api/list`
- `src/pages/todo/api/index.func.ts` -> `POST /todo/api`

注意：

- 不使用 `actions -> api` 之类的隐式映射或重写。
- 不在 `components/` 目录下放置 `*.func.ts`。

## 关键能力

- `beforeHandle`：请求进入云函数前执行自定义逻辑
- `onStart/onClose/onError`：生命周期钩子
- `middleware`：可挂到其他 Node HTTP 服务中
