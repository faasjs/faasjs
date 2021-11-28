# 在 Vue 中使用

FaasJS 提供了 `@faasjs/vue-plugin` 使得你可以在 Vue 组件中轻松调用云函数。

## 集成步骤

1. 安装插件 `npm install @faasjs/vue-plugin@beta --save`
2. 引入插件

```typescript
import Faas from '@faasjs/vue-plugin';

Vue.use(Faas, {
  domain: '' // 这里填写云函数的服务地址
});
```

## 使用方法

```typescript
// any.vue
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
