[@faasjs/ant-design](../README.md) / createOnErrorHandler

# Function: createOnErrorHandler()

> **createOnErrorHandler**(`messageApi`): (`action`) => (`res`) => `Promise`\<`void`>>>>\>

Create the default FaasJS request error handler used by [App](App.md).

The handler ignores aborted requests, logs other failures with the action path,
and shows the normalized message through Ant Design's message API.

## Parameters

### messageApi

Ant Design message API subset used to show errors.

#### error

(`message`) => `void`

## Returns

Error handler factory compatible with `FaasReactClientOptions.onError`.

(`action`) => (`res`) => `Promise`\<`void`\>
