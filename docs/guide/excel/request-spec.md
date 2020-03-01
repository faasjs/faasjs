# HTTP 请求规范

为了统一团队协作时请求规范不一致的情况，FaasJS 提供了内置的请求规范和配套的浏览器插件。

## 请求

### Headers

* **Content-Type**: application/json; charset=UTF-8

### Method

统一为 `POST`。

### Path

请求路径默认与项目中的目录名和文件名一致。

### Query

不建议使用，入参请通过 Body 传值。

### Body

为空或 JSON 格式。

## 响应

### Headers

* **Content-Type**: application/json; charset=UTF-8

#### StatusCode

* **200** 请求成功且有返回信息
* **201** 请求成功但没有返回信息
* **500** 请求失败

其它状态可根据具体业务情况添加。

### Body

#### 200 状态

* **data** 必有，业务信息

例：

```json
{
  "data": "value"
}
```
```json
{
  "data": {
    "key": "value"
  }
}
```

### 201 状态

无 body 内容。

### 500 状态

* **error** 必有，Error 对象
  * **message** 必有，错误信息内容

例：

```json
{
  "error": {
    "message": "出错啦"
  }
}
```

## 常见问题

### 为什么不使用表单形式提交数据？

因为表单提交数据有两个比较大的问题：一是格式只能为字符串，二是层级数据嵌套时，会导致提交的字数过多。

### 为什么不使用 Restful 或者 GraphQL？

Restful 的问题在于需要开发者对动词和名词有较深的理解，GraphQL 的问题在于解析和权限验证较复杂，在 FaaS 的环境中使用 Apollo 之类的框架会显得更重。

因此 FaasJS 综合了 Restful 和 GraphQL 中易于理解的部分，将请求标准设计为仅 `action` 和 `params` 的形式。
