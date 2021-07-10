# @faasjs/browser

浏览器插件，用于在浏览器中请求云函数。

## FaasBrowserClient 实例方法

### constructor (baseUrl?: string): FaasBrowserClient

构建插件实例，`baseUrl` 为云函数网关的网址，若不传值则视为开发环境，会在当前域名下请求 `/_faas/` 路径下的接口。

### action (action: string, params?: any): Promise\<Response\>

请求云函数，`action` 为云函数的路径，`params` 为传递的参数

## Response 实例属性

- **status** `number` 响应状态
- **headers** `object` 响应头
- **data** `any` 响应数据

## ResponseError 实例属性

- **message** `string` 错误提示
- **status** `number` 响应状态
- **headers** `object` 响应头
- **body** `any` 响应体

## 在 Vue 中使用

```typescript
// faas.ts
import FaasBrowserClient, { Response } from '@faasjs/browser';

declare module 'vue/types/vue' {
  interface Vue {
    $faas(action: string, params?: any): Promise<Response>
  }
}

export default {
  install (Vue: any) {
    const client = new FaasBrowserClient(location.hostname.indexOf('.com') < 0 ? '' : 'https://api.example.com');
    Vue.prototype.$faas = function (action: string, params?: any) {
      return client.action(action, params);
    };
  }
};

// app.vue
export default {
  mounted() {
    this.$faas('action', params).then(({data}) => {
      this.$set(this, 'data', data);
    }).catch(function(error){
      alert(error.message);
    })
  }
}
```

## Github 地址

[https://github.com/faasjs/faasjs/tree/master/packages/browser](https://github.com/faasjs/faasjs/tree/master/packages/browser)
