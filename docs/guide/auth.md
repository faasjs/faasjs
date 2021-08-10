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

    yarn faas new func users/signup sql http

然后在云函数文件中写业务代码：

```typescript
// users/signup.func.ts
import { useFunc } from '@faasjs/func';
import { useSql } from '@faasjs/sql';
import { useHttp } from '@faasjs/http';

export default useFunc(function () {
  const sql = useSql();
  const http = useHttp({
    validator: {
      params: {
        whitelist: 'error', // 确保只接受设定的参数
        rules: {
          username: { // 设置 username 为必填参数，类型为数字
            required: true,
            type: 'string'
          },
          password: { // 设置 password 为必填参数，类型为文本
            required: true,
            type: 'string'
          }
        }
      }
    }
  });

  return async function () {
    // 尝试直接插入，若插入失败会直接抛异常
    await sql.query('INSERT INTO users (username,password) VALUES (?, ?)', [http.params.username, http.params.password]);

    // 读取刚刚插入的数据，获取自增字段的用户 ID
    const row = await sql.queryFirst('SELECT id FROM users WHERE username = ? LIMIT 1', [http.params.username]);

    // 将用户 ID 保存到 session 中
    http.session.write('user_id', row.id);
  }
});
```

为了验证我们写的代码是否正确，我们需要写单元测试代码。

```typescript
// users/__tests__/signup.test.ts
import { FuncWarpper } from '@faasjs/test';
import { Sql } from '@faasjs/sql';
import { Http } from '@faasjs/http';

describe('signin', function () {
  // 在外部声明云函数变量，方便各个用例使用
  let func: FuncWarpper;

  beforeEach(async function () {
    // 使用 FuncWarpper 来引入云函数
    func = new FuncWarpper(require.resolve('../signup.func') as string);

    // 因为 sql 插件需要在云函数初始化时生成连接，所以这里需要使用 mountedHandler 来初始化云函数
    await func.mountedHandler({});

    // 为了便于测试用例中使用 sql 和 http 插件的功能，这里加了个简单的快捷入口
    func.sql = func.plugins[0] as Sql;
    func.http = func.plugins[1] as Http;

    // 创建表，若有数据则删除
     await func.sql.queryMulti([
      'CREATE TABLE IF NOT EXISTS "users" ("id" integer,"username" varchar UNIQUE,"password" varchar, PRIMARY KEY (id));',
      'DELETE FROM users;'
    ]);
  });

  test('should work', async function () {
    const res = await func.JSONhandler({ // JSONhandler 是一个辅助方法，可以以 JSON 的形式请求云函数
      username: 'hello',
      password: 'world'
    });

    // 解码 session 后检查用户 ID 是否设置正确
    expect(func.http.session.decode(res.headers['Set-Cookie'][0].match(/key=([^;]+)/)[1])).toEqual({ user_id: 1 });

    // 由于注册操作并不需要返回 data，因此响应状态为 201
    expect(res.statusCode).toEqual(201);
  });

  test('wrong username', async function () {
    const res = await func.JSONhandler({
      username: 'hello',
      password: 'world'
    });

    // 按照 FaasJS 的 HTTP 请求规范，错误会以 500 状态返回，错误原因被包裹在 error -> message 中
    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('{"error":{"message":"用户名错误"}}');
  });

  test('wrong password', async function () {
    const res = await func.handler({
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        username: 'hello',
        password: ''
      })
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('{"error":{"message":"用户名或密码错误"}}');
  });
});
```

## 登录流程

    yarn faas new func users/signin sql http

```typescript
// users/signin.func.ts
import { useFunc } from '@faasjs/func';
import { useSql } from '@faasjs/sql';
import { useHttp } from '@faasjs/http';

export default useFunc(function () {
  const sql = useSql();
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
    const row = await sql.queryFirst('SELECT id,password FROM users WHERE username = ? LIMIT 1', [http.params.username]);
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

    yarn new func users/signout sql http

```typescript
// users/signout.func.ts
import { useFunc } from '@faasjs/func';
import { useSql } from '@faasjs/sql';
import { useHttp } from '@faasjs/http';

export default useFunc(function () {
  const sql = useSql();
  const http = useHttp();

  return async function () {
    // 将值设为 null 即可删除改属性
    http.session.write('user_id', null);
  }
});
```

## 修改密码流程

    yarn faas new func users/change-password sql http

```typescript
// users/change-password.func.ts
import { useFunc } from '@faasjs/func';
import { useSql } from '@faasjs/sql';
import { useHttp } from '@faasjs/http';

export default useFunc(function () {
  const sql = useSql();
  const http = useHttp({
    validator: {
      session: { // session 也支持自动校验，比如校验 user_id 为必填来保证只有已登录的用户才能访问此接口
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
    const row = await sql.queryFirst('SELECT password FROM users WHERE id = ? LIMIT 1', [http.session.read('user_id')]);
    if (row.password !== http.params.old_password) {
      throw Error('旧密码错误');
    }
    await sql.query('UPDATE users SET password = ? WHERE id = ?', [http.params.new_password, http.session.read('user_id')]);
  }
});
```

## 完整项目代码

完整的项目代码在 [https://github.com/faasjs/examples/tree/master/auth](https://github.com/faasjs/examples/tree/master/auth) 其中还包括了完整的测试用例代码。
