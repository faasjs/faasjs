# 简单 Http 云函数

```typescript
import { useFunc } from '@faasjs/func';
import { useHttp } from '@faasjs/http';

export default useFunc(function () {
  const http = useHttp({
    validator: {
      params: {
        whitelist: 'error', // 入参白名单校验，若发现未配置的入参参数就报错
        rules: {
          id: {
            required: true, // 配置 id 为必填项
            type: 'number' // 配置 id 必须为数字类型
          }
        }
      }
    }
  });

  return async function () {
    return http.params.id; // 返回传入的 id
  }
});
```
