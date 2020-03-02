# 基于 COS 的密钥解决方案

为了避免将重要的密钥信息暴露在源代码中，我们可以将此类信息保存在 COS 中，并通过对云函数执行角色的权限配置来实现保密。

## 使用步骤

1. 在腾讯云的[对象存储](https://console.cloud.tencent.com/cos5)服务中新建一个桶，用于存放密钥信息。
2. 将密钥文件以 JSON 格式上传到储存桶中，默认文件名为 `secrets.json`。
3. 在腾讯云的[访问管理](https://console.cloud.tencent.com/cam/policy)中新建自定义策略，策略语法示例见后文。
4. 将新创建的策略加到云函数的执行角色中。
5. 添加 `@faasjs/cos-secrets` 作为依赖项，并引入，引入代码示例见后文。

## 策略语法示例

需要将其中的 `uid/123456` 改成自己账号的 uid 信息；将 `secrets-123456` 改成新建的储存桶名字；将 `testing` 改成发布环境名。

```json
{
  "version": "2.0",
  "statement": [
    {
      "effect": "allow",
      "action": [
        "name/cos:GetObject"
      ],
      "resource": [
        "qcs::cos:ap-shanghai:uid/123456:secrets-123456/testing/*"
      ]
    }
  ]
}
```

## 使用示例

假设我们的账号 uid 是 `123456`，新建的储存桶名字是 `secrets-123456`，密钥文件被上传至 `testing/secrets.json`。

假设密钥文件内容为：

```json
{
  "mysql": {
    "user": "username",
    "password": "abc123"
  }
}
```

项目代码需要修改这两处：

### faas.yaml

```yaml
plugins:
  cosSecrets:
    config:
      bucket: secrets-123456
      region: ap-shanghai
      key: testing/secrets.json
```

### 云函数文件

密钥内容可以通过两种方式读取，一种是通过 `.data` 方法，一种是通过 `process.env`。

`process.env` 会统一加上 `SECRET_` 前缀，且变量名全部大写，若值是一个 object，则会根据 object 的 key 进一步拆分。

**注意：为了保证密钥在初始化的第一步就准备好，请务必将其放在 plugins 的第一个**

```typescript
import { Func } from '@faasjs/func';
import { CosSecrets } from '@faasjs/cos-secerts';

const secrets = new CosSecrets();

export default new Func({
  plugins: [secrets],
  handler() {
    console.log(secrets.data.mysql); // => { user: 'username', password: 'abc123' }
    console.log(process.env.SECRET_MYSQL_USER); // => 'username'
    console.log(process.env.SECRET_MYSQL_PASSWORD); // => 'abc123'
  }
});
```
