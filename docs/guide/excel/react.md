# 在 React 中使用

FaasJS 提供了 `@faasjs/react` 使得你可以在 React 中轻松调用云函数。

## 集成步骤

1. 安装插件 `npm install @faasjs/react@beta --save`
2. 引入插件

```typescript
// faas.ts
import { FaasClient } from '@faasjs/react';

const client = FaasClient({
  domain: '' // 这里填写云函数的服务地址
});

export const faas = client.faas;
export const useFaas = client.useFaas;
```

## 使用方法

```tsx
// demo.tsx
import React from 'react';
import { useFaas } from './faas';

interface User {
  id: string;
}

export function Demo () {
  const user = useFaas<User>('user/current');

  if (!user.data) return <>载入中</>;

  return <>ID: {user.data.id}</>
}
```
