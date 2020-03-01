# 定时执行的云函数

```typescript
import { Func } from '@faasjs/func';
import { CloudFunction } from '@faasjs/cloud_function';

const cf = new CloudFunction({
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

export default new Func({
  plugins: [cf],
  handler(){
    return 'work';
  }
});
```
