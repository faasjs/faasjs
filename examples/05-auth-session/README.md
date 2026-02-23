# 05 Auth Session

Implement signup/signin/signout/change-password with cookie-based session.

实现注册、登录、登出、改密，并使用基于 Cookie 的 Session。

## What you learn / 你将学到

- Session read/write in FaasJS handlers.
- Basic auth flow split into multiple functions.
- How to test stateful APIs with `@faasjs/dev`.

- 如何在 handler 中读写 Session。
- 如何按业务流程拆分多个云函数。
- 如何用 `@faasjs/dev` 测试有状态接口。

> For demo simplicity, passwords are stored in plain text.
>
> 为了简化示例，密码以明文存储；实际项目请务必加密。

## Run / 运行

```bash
npm install
npm run test
npm run migrate:latest
npm run dev
```

Example request:

```bash
curl -X POST http://127.0.0.1:3000/users/api/signup \
  -H 'content-type: application/json' \
  -d '{"username":"alice","password":"alice-password"}'
```
