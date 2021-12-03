# @faasjs/func

FaasJS 的主体模块，用于初始化云函数。

## 使用方法

```typescript
// 引入 useFunc 方法
import { useFunc } from '@faasjs/func'

/**
 * 生成云函数主体，有以下注意点：
 * 1. 必须是 export default
 * 2. 入参为一个函数，函数需要返回一个业务函数，且须为 Promise 函数
 */
export default useFunc(function () {
  // 若有需要初始化的插件，可以在这里初始化

  // 返回业务函数
  return async function () {
    // 业务函数
  }
})
```
