# @faasjs/cloud_function

FaasJS 内置插件，无需额外安装。

## 配置参数

- **name** `string` 云函数名字，默认为文件夹+文件名
- **memorySize** `number` 内存，单位为 MB，默认为 128
- **timeout** `number` 最大执行时长，单位为秒，默认为 30
- **triggers** `object` 触发器配置
  - **type** `string` 触发器类型
  - **name** `string` 触发器名字
  - **value** `string` 触发器设置

### 校验配置

- **whitelist** `'error' | 'ignore'` 是否只允许 `rules` 中声明的入参，当遇到未声明的入参，`error` 会直接抛异常，`ignore` 不会报错，但会删除未声明的入参
- **rules** `object` 参数校验规则
  - **required** `boolean` 是否必填，设置为 `true` 时，将不允许值为 `undefined` 或 `null`
  - **type** `string` 支持 `string`、`number`、`boolean`、`array` 和 `object`
  - **in** `array` 判断值是否在列表中
  - **default** `any` 若值为 `undefined`，则会将默认值赋上，若这里配置为函数，则会将整个请求作为入参传入，将函数的返回值赋上
  - **config** `object` 内嵌对象的校验规则，配置项同上

#### 代码示例

```typescript
import { CloudFunction } from '@faasjs/cloud_function';

const cf = new CloudFunction({
  validator: {
    event: {
      whitelist: 'error',
      rules: {
        key: {
          required: true,
          type: 'number',
          in: [1, 2],
          default: 1
        }
      }
    }
  }
});
```

## 实例属性

### event

云函数的事件对象

### context

云函数的环境对象

## 实例方法

### invoke(action: string, params?: any): Promise\<any\>

异步触发其它云函数

- **action** 云函数的名字，如 `user/create`
- **params** 传递的参数

### invokeSync(action: string, params?: any): Promise\<any\>

同步调用其它云函数

- **action** 云函数的名字，如 `user/create`
- **params** 传递的参数

## 示例代码

```typescript
import { Func } from '@faasjs/func';
import { CloudFunction } from '@faasjs/cloud_function';

// 创建一个云函数插件实例
const cf = new CloudFunction({
  config: {
    timeout: 100 // 将云函数的最大执行时间设为 100 秒
  }
});

export default new Func({
  plugins: [cf], // 将实例放到云函数的插件中
  async handler(){
    // 显示入参
    console.log(cf.event);

    // 触发另外一个云函数
    await cf.invoke('another/function_name', { data: 'Hello' });

    return true;
  }
});
```

## Github 地址

[https://github.com/faasjs/faasjs/tree/main/packages/cloud_function](https://github.com/faasjs/faasjs/tree/main/packages/cloud_function)
