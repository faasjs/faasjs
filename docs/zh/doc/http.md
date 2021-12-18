# @faasjs/http

FaasJS 内置插件，无需额外安装。

Http 插件可以使云函数能够接收和处理网络请求。

同时还提供 cookie 和基于 cookie 的 seesion 功能。

此外，强烈建议按 [FaasJS 请求规范](/guide/request-spec.html) 进行网络通讯。

## 配置参数

- **method** `string` 英文大写的方法名，默认为 `POST`
- **timeout** `number` 超时时间，单位为秒，默认为 `30`
- **cookie** `object` cookie 配置项
  - **domain** `string` 域名
  - **path** `string` 路径，默认为 `/`
  - **expires** `number` 过期时间，默认为 `31536000`（365天）
  - **secure** `boolean` 是否为 secure，默认为 `true`
  - **httpOnly** `boolean` 是否为 httpOnly，默认为 `true`
  - **sameSite** `string` 支持 `Strict`、`Lax` 和 `None`
  - **session** `object` session 配置项，必须配置 `key` 和 `secret` 才能启用session 功能
    - **key** `string` cookie 中保存 session 信息的 key
    - **secret** `string` 加密 session 信息的密钥
    - **salt** `string` 加密用的 salt，默认为 `salt`
    - **signedSalt** `string` 加密用的 signedSalt，默认为 `signedSalt`
    - **keylen** `number` 加密用的 keylen，默认为 `64`
    - **iterations** `number` 加密用的 iterations，默认为 `100`
    - **digest** `string` 加密用的 digest，默认为 `sha256`
    - **cipherName** `string` 加密用的 cipherName，默认为 `aes-256-cbc`

## 入参校验

除了标准的配置参数外，Http 插件还支持入参校验功能。

### 配置项

- **params** `object` body 校验配置
- **cookie** `object` cookie 校验配置
- **session** `object` session 校验配置

#### 校验配置

- **whitelist** `'error' | 'ignore'` 是否只允许 `rules` 中声明的入参，当遇到未声明的入参，`error` 会直接抛异常，`ignore` 不会报错，但会删除未声明的入参
- **onError** `function` 自定义报错信息，函数入参为 `type: string, key: string | string[], value?: any`
- **rules** `object` 参数校验规则
  - **required** `boolean` 是否必填，设置为 `true` 时，将不允许值为 `undefined` 或 `null`
  - **type** `string` 支持 `string`、`number`、`boolean`、`array` 和 `object`，**cookie 不支持此规则**
  - **in** `array` 判断值是否在列表中
  - **default** `any` 若值为 `undefined`，则会将默认值赋上，若这里配置为函数，则会将整个 `params` 作为入参传入，将函数的返回值赋上，**cookie 和 session 不支持此规则**
  - **config** `object` 内嵌对象的校验规则，配置项同上

### 代码示例

#### 简单校验

```typescript
import { Http } from '@faasjs/http';

const http = new Http({
  validator: {
    params: {
      whitelist: 'error',
      rules: {
        key: {
          required: true,
          type: 'number',
          in: [1, 2],
          default: 1
        }
      }
    }
  }
});
```

#### 多层校验

```typescript
import { Http } from '@faasjs/http';

const http = new Http({
  validator: {
    params: {
      whitelist: 'error',
      rules: {
        key: {
          required: true,
          type: 'object',
          config: {
            whitelist: 'error',
            rules: {
              subKey: {
                in: [1, 2],
                default: 1
              }
            }
          }
        }
      }
    }
  }
});
```

#### 自定义报错

```typescript
import { Http } from '@faasjs/http';

const http = new Http({
  validator: {
    session: {
      whitelist: 'error',
      rules: {
        user_id: {
          required: true,
          type: 'number'
        }
      },
      onError(type, key, value){
        if(type === 'session.rule.required' && key === 'user_id'){
          return {
            statusCode: 401,
            message: '请先登录'
          }
        }
      }
    }
  }
});
```

## 云函数 handler 返回值的处理

为了符合 [FaasJS 请求规范](/guide/request-spec.html)，Http 插件会对 handler 的返回值进行特殊处理。规则为：

### 自动添加 headers 和 statusCode

自动在 `headers` 中添加 `Content-Type` 和 `X-Request-Id`。

当 handler 直接 `return` 没有返回内容时，`statusCode` 自动设为 `201`；有返回内容时，`statusCode` 自动设为 `200`。

当 handler 中抛异常时，`statusCode` 自动设为 `500`。

### 正常返回的值会被自动包裹在 data 字段中

```typescript
import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';

const http = new Http();

export default new Func({
  plugins: [http],
  async handler(){
    return true;
  }
}); // 将返回 {"data":true}
```

### 抛异常时会自动返回 error 字段

```typescript
import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';

const http = new Http();

export default new Func({
  plugins: [http],
  async handler(){
    throw Error('wrong');
  }
}); // 将返回 {"error":{"message":"wrong"}}
```

## 实例属性

### headers

请求头

### params

请求参数，默认取 body 中的内容，且当 headers 中声明类型为 json 时，会自动解析为 object。

### cookie

cookie 实例

### session

session 实例

## 实例方法

### setHeader (key: string, value: any): Http

设置响应的请求头，可以覆盖默认的请求头

### setContentType (type: string, charset: string = 'utf-8'): Http

设置响应类型，支持常见类型的简写，如 `plain`、`html`、`css`、`javascript` 等。

### setStatusCode (code: number): Http

设置响应状态码，可以覆盖默认的状态码

### setBody (body: string): Http

设置 Body，可以覆盖默认的 Body 且不会被包裹在 data 字段中也不会被 JSON 序列化

## Cookie 实例方法

### read(key: string): string?

读取 cookie 信息

### write(key: string, value: any, opts?: {domain?: string; path?: string; expires?: number | string; secure?: boolean; httpOnly?: boolean;}): Cookie

写入 cookie 信息

## Session 实例方法

### read(key: string): any

读取 session 信息

### write(key: string, value?: any): Session

写入 session 信息

### encode(text: any): string

加密信息

### decode(text: string): object

解密信息

## 示例代码

```typescript
import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';

const http = new Http({
  config: {
    method: 'GET' // 设置请求方法为 GET，默认为 POST
  }
});

export default new Func({
  plugins: [http], // 将实例放到云函数的插件中
  async handler(){
    console.log(http.params); // 打印请求入参
    return http.cookie!.read('key'); // 读取 cookie 中的值
  }
});
```

## 常见问题

### Path 自动生成的规则是什么？

Path 会按照文件夹和文件名自动生成，并会去掉 Path 的第一级文件夹的名字和最后的 `/index`。

如：

`funcs/product/show.func.ts` => `/product/show`

`funcs/product/index.func.ts` => `/product`

### 为什么不允许配置 path？

不允许配置 Path 是为了保证所有云函数文件的目录位置与网关的 Path 完全对应，便于后期维护迭代。

### 多个网关如何配置？

在 faas.yaml 中，可以配置不同的网关，在云函数中初始化插件时，将配置名传入即可。

若一个云函数需要接收多个网关的请求，可以创建多个插件实例，部署时会逐一部署。

## Github 地址

[https://github.com/faasjs/faasjs/tree/main/packages/http](https://github.com/faasjs/faasjs/tree/main/packages/http)
