# 5 分钟开发登录注册功能

在学习本教程前，建议先学习 [1 分钟上手](/zh/guide/)。

通过本教程，你将学到：

- 如何将需求拆解为云函数？
- 如何使用 Session 来识别用户？
- 如何使用入参校验来避免恶意攻击？
- 如何在云函数中使用 Sql？

## 梳理需求

为了简化教程，我们将登陆注册功能，限定为仅支持使用用户名和密码来注册和登录。

因此把功能点梳理为：

- 用户可以通过输入用户名和密码，来完成注册；
- 注册完成后直接成为已登录状态；
- 在已登录状态下，用户可以修改自己的密码；
- 用户可以登出；
- 用户可以登录；

为了实现需求，我们需要分两步来设计：数据库设计和云函数设计。

先确定数据库表结构为：

- **users** 表名
  - **id** `number` 自增主键
  - **username** `string` 用户名，不可重复
  - **password** `string` 密码（这里为了简化教程，密码采用明码保存，在实际业务中请务必加密保存！！）

接下来，云函数的设计，需要根据业务流程来梳理，通常来说，有几个业务流程，就创建几个云函数：

- 注册流程
  - 入参：用户名、密码
  - 出参：在 seesion 中保存用户 ID
  - 业务逻辑：把用户名和密码保存到数据库中，并在 seesion 中保存用户 ID
- 登录流程
  - 入参：用户名、密码
  - 出参：在 seesion 中保存用户 ID
  - 业务逻辑：检查用户名和密码是否与数据库中保存的一致，一致则在 seesion 中写入用户 ID
- 登出流程
  - 入参：seesion 中当前登录用户的 ID
  - 出参：删除 session 的登录用户 ID
  - 业务逻辑：删除 session 中的用户 ID
- 修改密码：
  - 入参：新密码、旧密码、seesion 中当前登录用户的 ID
  - 出参：无
  - 业务逻辑：检查旧密码是否与数据库中存储的一致，一致的话替换为新密码

基于以上梳理，我们知道了要完成这个功能，我们需要创建 1 张数据库表和 4 个云函数。

## 注册流程

数据库建表这里就略过了，我们直接从云函数开始写起。

我们按上面列出的业务逻辑顺序，来写云函数，首先是注册流程。

我们先手动创建云函数文件 `users/api/signup.func.ts`：

然后在云函数文件中写业务代码：

```typescript
// users/api/signup.func.ts
import { defineFunc, z } from '@faasjs/core';

const schema = z.object({
  username: z.string(),
  password: z.string()
}).required();

export const func = defineFunc({
  schema,
  async handler({ knex, params, session }) {
    if (!knex || !params) {
      throw Error('缺少插件配置');
    }

    const row = await knex('users')
      .select('id', 'password')
      .where('username', '=', params.username)
      .first();

    if (!row) {
      throw Error('用户名错误');
    }

    if (row.password !== params.password) {
      throw Error('用户名或密码错误');
    }

    session.write('user_id', row.id);
  }
});
```

为了验证我们写的代码是否正确，我们需要写单元测试代码。

```typescript
// users/api/__tests__/signup.test.ts
import { useKnex } from '@faasjs/knex';
import { FuncWarper } from '@faasjs/dev';

describe('signin', function () {
  const func = new FuncWarper(require.resolve('../signin.func'));

  beforeEach(async function () {
    await useKnex().raw('INSERT INTO users (id,username,password) VALUES (1,\'hello\',\'world\')');
  });

  test('should work', async function () {
    const res = await func.JSONhandler({
      username: 'hello',
      password: 'world'
    });

    expect(func.http.session.decode(res.headers['Set-Cookie'][0].match(/key=([^;]+)/)[1])).toEqual({ user_id: 1 });
    expect(res.statusCode).toEqual(204);
  });

  test('wrong username', async function () {
    const res = await func.JSONhandler({
      username: '',
      password: ''
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('{"error":{"message":"用户名错误"}}');
  });

  test('wrong password', async function () {
    const res = await func.JSONhandler({
      username: 'hello',
      password: ''
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('{"error":{"message":"用户名或密码错误"}}');
  });
});
```

## 登录流程

先创建 `users/api/signin.func.ts` 文件：

```typescript
// users/api/signin.func.ts
import { defineFunc, z } from '@faasjs/core';

const schema = z.object({
  username: z.string(),
  password: z.string()
}).required();

export const func = defineFunc({
  schema,
  async handler({ knex, params, session }) {
    if (!knex || !params) {
      throw Error('缺少插件配置');
    }

    const row = await knex('users')
      .where({ username: params.username })
      .select('id', 'password')
      .first();
    if (!row) {
      // 在云函数中，建议直接通过抛异常的方式来告知前端错误信息
      throw Error('用户名错误');
    }
    if (row.password !== params.password) {
      throw Error('用户名或密码错误');
    }

    session.write('user_id', row.id);
  }
});
```

## 登出流程

先创建 `users/api/signout.func.ts` 文件：

```typescript
// users/api/signout.func.ts
import { defineFunc } from '@faasjs/core';

export const func = defineFunc({
  async handler({ session }) {
    session.write('user_id', null);
  }
});
```

## 修改密码流程

先创建 `users/api/change-password.func.ts` 文件：

```typescript
// users/api/change-password.func.ts
import { defineFunc, z } from '@faasjs/core';

const schema = z.object({
  new_password: z.string(),
  old_password: z.string()
}).required();

export const func = defineFunc({
  schema,
  async handler({ knex, params, session }) {
    if (!knex || !params) {
      throw Error('缺少插件配置');
    }

    const userId = session.read('user_id');

    if (typeof userId !== 'number') {
      throw Error('未登录');
    }

    const row = await knex('users')
      .select('password')
      .where('id', '=', userId)
      .first();
    if (row.password !== params.old_password) {
      throw Error('旧密码错误');
    }
    await knex('users').where('id', '=', userId).update({
      password: params.new_password
    });
  }
});
```

## 完整项目代码

完整的项目代码在 [https://github.com/faasjs/faasjs/examples/tree/main/auth](https://github.com/faasjs/faasjs/examples/tree/main/auth) 其中还包括了完整的测试用例代码。
