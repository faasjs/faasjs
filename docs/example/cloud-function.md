# 简单云函数

```typescript
import { useFunc } from '@faasjs/func';

export default useFunc(function () {
  return async function () {
    return 'work';
  }
});
```
