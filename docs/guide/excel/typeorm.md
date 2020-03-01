# 集成 TypeORM

在云函数中集成 [TypeORM](https://typeorm.io/)。

此插件非 `faasjs` 内置，使用前请先通过 `yarn add @faasjs/typeorm@beta` 安装。

## 使用示例

```typescript
import { Func } from '@faasjs/func';
import { TypeORM } from '@faasjs/typeorm';
import { Entity, Column, BaseEntity } from 'typeorm';

@Entity()
class User extends BaseEntity {
  @Column()
  name: string;
}

const typeorm = new TypeORM({
  config: {
    type: 'sqlite',
    entities: [
      User
    ]
  }
});

export default new Func({
  async handler(){
    const user = new User();
    user.name = 'Ben';
    await user.save();
  }
});
```
