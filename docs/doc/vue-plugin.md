# @faasjs/vue-plugin

Vue 插件。

## 安装方法

### npm

    npm install @faasjs/vue-plugin --save

### Webpack 和 CDN

在 html 中添加如下代码：

```html
<script type="text/javascript" src="//cdn.jsdelivr.net/npm/@faasjs/vue-plugin"></script>
```

在 webpack.config.js 中添加如下代码：

```javascript
module.exports = {
  // ...
  externals: {
    '@faasjs/vue-plugin': 'FaasVuePlugin'
  }
}
```


## 在 Vue 中使用

```typescript
// faas.ts
import FaasVuePlugin from '@faasjs/vue-plugin';

Vue.use(FaasVuePlugin, { domain: process.env.FAAS as string })

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
