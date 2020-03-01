# 简单云函数

```typescript
import { Func } from '@faasjs/func';

export default new Func({
  plugins: [],
  handler(){
    return 'work';
  }
});
```
