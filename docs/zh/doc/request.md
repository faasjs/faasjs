# @faasjs/request

FaasJS 内置插件，无需额外安装。

简化版网络请求插件，主要用于请求接口。

## 入参

- **url** `string` 请求网址
- **options** `object` 请求配置项
  - **method** `string` 请求方法，默认为 `GET`
  - **query** `object` 请求参数
  - **headers** `object` 请求头
  - **body** `any` 请求体

## 出参

注意：出参为 Promise 对象。

- **request** `object` 请求对象
- **statusCode** `number` 状态码
- **statusMessage** `string` 状态信息
- **headers** `object` 响应头
- **body** `any` 响应内容

## 代码示例

```typescript
import { request } from '@faasjs/request';

request('https://google.com', {
  query: {
    q: 'key'
  }
}).then(console.log).catch(console.error);
```

## 模拟模式

为了便于单元测试，Request 插件也支持模拟模式，可以拦截请求并返回配置的响应。

代码示例如下：

```typescript
import { request, setMock } from '@faasjs/request';

setMock(function (url, options) {
  return new Promise(function (resolve) {
    resolve({
      statusCode: 200,
      headers: {},
      body: 'world'
    });
  });
});

request('https://hello.com').then(console.log); // 必定会返回 body 为 world
```

## Github 地址

[https://github.com/faasjs/faasjs/tree/main/packages/request](https://github.com/faasjs/faasjs/tree/main/packages/request)
