# 使用插件

FaasJS 中插件分两类，一类是云函数插件，须在创建云函数时注入才能正常使用，另外一类是非云函数插件，使用方法同普通的 npm 库。

## 创建插件实例

### 使用默认配置

```yaml
# faas.yaml
defaults:
  plugins:
    fake_plugin:
      config:
        key: value
```

```typescript
// demo.func.ts
import { Func } from '@faasjs/func';
import { Plugin } from 'fakePlugin';

const plugin = new Plugin();

export default new Func({
  plugins: [plugin],
  handler(){}
});
```

### 使用指定配置

```yaml
# faas.yaml
defaults:
  plugins:
    special:
      config:
        key: value
```

```typescript
// demo.func.ts
import { Func } from '@faasjs/func';
import { Plugin } from 'fakePlugin';

const plugin = new Plugin({
  name: 'special'
});

export default new Func({
  plugins: [plugin],
  handler(){}
});
```

### 自定义配置

```typescript
// demo.func.ts
import { Func } from '@faasjs/func';
import { Plugin } from 'fakePlugin';

const plugin = new Plugin({
  config: {
    key: 'value'
  }
});

export default new Func({
  plugins: [plugin],
  handler(){}
});
```

自定义配置也可以跟指定配置混合使用，覆盖指定配置中部分配置项。

## 配置的优先级

插件的配置可以在引用插件时在代码中直接配置，也可以在 **faas.yaml** 中配置。

配置的优先级为：云函数代码中的配置 > 云函数文件所在文件夹的 `faas.yaml` > 父文件夹的 `faas.yaml` > 更浅层级文件夹中的 `faas.yaml`。

### 最佳实践

对于共用和常用的配置，建议都配置在 `faas.yaml` 中。

仅某个云函数用到的特殊配置，可以直接在云函数的代码中配置。
