# @faasjs/browser

浏览器插件，用于在浏览器中请求云函数。

## 安装方法

### npm

    npm install @faasjs/browser --save

### Webpack 和 CDN

在 html 中添加如下代码：

```html
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/@faasjs/browser"></script>
```

在 webpack.config.js 中添加如下代码：

```javascript
module.exports = {
  // ...
  externals: {
    '@faasjs/browser': 'FaasBrowserClient'
  }
}
```

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

## 在 React 或 Vue 中使用

- [@faasjs/react](https://faasjs.com/doc/react.html)
- [@faasjs/vue-plugin](https://faasjs.com/doc/vue-plugin.html)
