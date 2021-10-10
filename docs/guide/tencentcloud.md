# 2 分钟部署到腾讯云

注：欢迎加入 QQ 群（772109193）与大家一起交流学习。

在学习本教程前，建议先学习 [1 分钟上手](/guide)。

通过本教程，你将学到：

- 使用 FaasJS 需要开通哪些云服务？
- 如何将云函数部署到腾讯云上？

## 准备工作

注册 [腾讯云](https://cloud.tencent.com/) 并完成实名验证。

## 开通服务

FaasJS 需要开通以下三个服务，依次点开即可开通：

1. **云函数** [https://console.qcloud.com/scf](https://console.qcloud.com/scf)
2. **API网关** [https://console.qcloud.com/apigateway/index](https://console.qcloud.com/apigateway/index)
3. **对象存储** [https://console.qcloud.com/cos5](https://console.qcloud.com/cos5)

## 获取腾讯云配置信息

FaasJS 需要将以下 4 个配置信息填写到 `faas.yaml`：

- **appId** 腾讯云的 APPID，在 [https://console.cloud.tencent.com/developer](https://console.cloud.tencent.com/developer) 获取
- **region** 可用区，目前腾讯云仅下面 4 个可用区可以完整支持 FaasJS：
  - **ap-beijing** 华北地区(北京)
  - **ap-shanghai** 华东地区(上海)
  - **ap-guangzhou** 华南地区(广州)
  - **ap-hongkong** 港澳台地区(中国香港)
- **secretId** 和 **secretKey** 腾讯云接口密钥信息，获取方式如下：

1. 打开 [https://console.cloud.tencent.com/cam/capi](https://console.cloud.tencent.com/cam/capi)
2. 创建一个子账号，并给与三个权限：
  - **QcloudSCFFullAccess**
  - **QcloudCOSFullAccess**
  - **QcloudAPIGWFullAccess**
3. 获取子账号的 secretId 和 secretKey

完成了 `faas.yaml` 中配置后，就可以发布到腾讯云了。

## 发布到腾讯云

FaasJS 的发布指令格式为 `npm exec faas deploy <env> <file>`，示例如下：

    npm exec faas deploy production hello.func.ts

其中 `production` 即环境名，`hello.func.ts` 即要发布的云函数文件名。

## 附录

### 云函数发布流程

1. 生成配置项
2. 生成代码包
  1. 生成 index.js
  2. 生成 package.json
  3. 生成 node_modules
3. 打包代码包
4. 创建 Cos Bucket
  1. 检查 Cos Bucket 状态
  2. 创建 Cos Bucket 或跳过
5. 上传代码包
6. 创建命名空间
  1. 检查命名空间状态
  2. 创建命名空间或跳过
7. 创建/更新云函数
  1. 检查云函数状态
  2. 创建/更新云函数
  3. 等待云函数创建/更新完成
8. 发布版本
9. 创建/更新触发器
  1. 删除旧触发器
  2. 创建触发器
10. 清理文件
  1. 清理 Cos Bucket
  2. 清理本地文件
11. 完成发布
