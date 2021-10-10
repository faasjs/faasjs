# @faasjs/react

React 插件。

## 安装方法

### npm

    npm install @faasjs/react --save

### Webpack 和 CDN

在 html 中添加如下代码：

```html
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/@faasjs/react"></script>
```

在 webpack.config.js 中添加如下代码：

```javascript
module.exports = {
  // ...
  externals: {
    '@faasjs/react': 'FaasReactClient'
  }
}
```

## 初始化

```typescript
import { FaasReactClient } from '@faasjs/react'

const client = FaasReactClient({
  domain: process.env.FAAS as string
})

export const faas = client.faas
export const useFaas = client.useFaas
```
