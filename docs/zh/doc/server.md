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

## 关键能力

- `beforeHandle`：请求进入云函数前执行自定义逻辑
- `onStart/onClose/onError`：生命周期钩子
- `middleware`：可挂到其他 Node HTTP 服务中
