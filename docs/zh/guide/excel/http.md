# Http、Cookie 和 Session

`@faasjs/http` 提供了以下功能：

- 网络请求的入参校验
- 规范化网络响应（基于 [HTTP 请求规范](/guide/excel/request-spec.html)）
- Cookie 的校验和读写
- Session 的校验和读写（Session 被加密储存在 Cookie 中）

## 校验示例

```typescript
import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';

const http = new Http({
  validator: {
    params: {
      whitelist: 'error', // 入参白名单校验，若发现未配置的入参会报错，避免攻击
      rules: {
        status: {
          required: true, // 配置 id 为必填项
          type: 'number', // 配置 id 必须为数字类型
          in: [0, 1, 2], // status 的值必须为 0, 1, 2 中的一种
        }
      }
    }
  }
});

export default new Func({
  plugins: [http],
  handler(){
    return http.params.id; // 返回传入的 id
  }
});
```

## Cookie 使用示例

```typescript
import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';

const http = new Http({
  validator: {
    cookie: {
      rules: {
        distinct_id: {
          required: true // 若 cookie 中没有 distinct_id 则报错
        }
      }
    }
  }
});

export default new Func({
  plugins: [http],
  handler(){
    http.cookie.write('user_id', http.cookie.read('distinct_id')); // 将 cookie 中的 distinct_id 写入为 user_id
  }
});
```

## Session 使用示例

```typescript
import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';

const http = new Http({
  validator: {
    session: {
      rules: {
        distinct_id: {
          required: true // 若 session 中没有 distinct_id 则报错
        }
      }
    }
  }
});

export default new Func({
  plugins: [http],
  handler(){
    http.session.write('user_id', http.session.read('distinct_id')); // 将 session 中的 distinct_id 写入为 user_id
  }
});
```

## Http 插件文档

详细文档见 [Http 插件](/doc/http.html)。
