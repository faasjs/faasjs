# 5 分钟开发登录注册功能

在学习本教程前，建议先学习 [1 分钟上手](/guide) 和 [2 分钟部署到腾讯云](/guide/tencentcloud)。

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

我们先通过命令行创建云函数文件：

    npm exec faas new func users/signup http knex

然后在云函数文件中写业务代码：

```typescript
// users/signup.func.ts
import { useFunc } from '@faasjs/func';
import { useKnex } from '@faasjs/knex';
import { useHttp } from '@faasjs/http';

export default useFunc(function () {
  const knex = useKnex();
  const http = useHttp<{
    username: string;
    password: string;
  }>({
    validator: {
      params: {
        whitelist: 'error',
        rules: {
          username: {
            required: true,
            type: 'string'
          },
          password: {
            required: true,
            type: 'string'
          }
        }
      }
    }
  });

  return async function () {
    const row = await knex.query('users')
      .select('id', 'password')
      .where('username', '=', http.params.username)
      .first();

    if (!row) {
      throw Error('用户名错误');
    }

    if (row.password !== http.params.password) {
      throw Error('用户名或密码错误');
    }

    http.session.write('user_id', row.id);
  }
});
```

为了验证我们写的代码是否正确，我们需要写单元测试代码。

```typescript
// users/__tests__/signup.test.ts
import { useKnex } from '@faasjs/knex';
import { FuncWarper } from '@faasjs/test';

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
    expect(res.statusCode).toEqual(201);
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

    npm exec faas new func users/signin http knex

```typescript
// users/signin.func.ts
import { useFunc } from '@faasjs/func';
import { useKnex, query } from '@faasjs/knex';
import { useHttp } from '@faasjs/http';

export default useFunc(function () {
  useKnex();
  const http = useHttp({
    validator: {
      params: {
        whitelist: 'error',
        rules: {
          username: {
            required: true,
            type: 'string'
          },
          password: {
            required: true,
            type: 'string'
          }
        }
      }
    }
  });

  return async function () {
    const row = await query('users')
      .where({ username: http.params.username })
      .select('id', 'password')
      .first();
    if (!row) {
      // 在云函数中，建议直接通过抛异常的方式来告知前端错误信息
      throw Error('用户名错误');
    }
    if (row.password !== http.params.password) {
      throw Error('用户名或密码错误');
    }

    http.session.write('user_id', row.id);
  }
});
```

## 登出流程

    npm exec faas new func users/signout http

```typescript
// users/signout.func.ts
import { useFunc } from '@faasjs/func';
import { useHttp } from '@faasjs/http';

export default useFunc(function () {
  const http = useHttp()

  return async function () {
    http.session.write('user_id', null);
  }
});
```

## 修改密码流程

    npm exec faas new func users/change-password http knex

```typescript
// users/change-password.func.ts
import { useFunc } from '@faasjs/func';
import { useKnex, query } from '@faasjs/knex';
import { useHttp } from '@faasjs/http';

export default useFunc(function () {
  useKnex()
  const http = useHttp({
    validator: {
      session: {
        rules: {
          user_id: {
            required: true,
            type: 'number'
          }
        }
      },
      params: {
        whitelist: 'error',
        rules: {
          new_password: {
            required: true,
            type: 'string'
          },
          old_password: {
            required: true,
            type: 'string'
          }
        }
      }
    }
  });

  return async function () {
    const row = await query('users')
    .select('password')
    .where('id', '=', http.session.read('user_id'))
    .first();
    if (row.password !== http.params.old_password) {
      throw Error('旧密码错误');
    }
    await query('users').where('id', '=', http.session.read('user_id')).update({
      password: http.params.new_password
    })
  }
});
```

## 完整项目代码

完整的项目代码在 [https://github.com/faasjs/faasjs/examples/tree/main/auth](https://github.com/faasjs/faasjs/examples/tree/main/auth) 其中还包括了完整的测试用例代码。
