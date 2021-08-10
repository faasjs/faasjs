# 定时执行的云函数

```typescript
import { useFunc } from '@faasjs/func';
import { useCloudFunction } from '@faasjs/cloud_function';

export default useFunc(function () {
  useCloudFunction({
    config: {
      triggers: [
        {
          type: 'timer',
          name: 's60',
          value: '*/60 * * * * * *' // 每 60 秒触发一次
        }
      ]
    }
  });

  return async function () {
    return 'work';
  }
});
```
