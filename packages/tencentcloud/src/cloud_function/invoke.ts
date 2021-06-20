import scf from './scf'
import Tencentcloud from '..'

export async function invokeCloudFunction<TResult = any> (tc: Tencentcloud, name: string, data?: { [key: string]: any }, options?: {
  [key: string]: any
}): Promise<TResult> {
  tc.logger.debug('invokeFunction: %s %O %O', name, options, data)

  if (process.env.FaasMode === 'local') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const test = require('@faasjs/test')
    const func = new test.FuncWarpper(require.resolve(name + '.func'))
    await func.mount()
    return func.handler(data)
  } else
    return scf(tc, Object.assign({
      Action: 'Invoke',
      FunctionName: name.replace(/[^a-zA-Z0-9-_]/g, '_'),
      ClientContext: JSON.stringify(data),
      InvocationType: 'Event',
      Namespace: process.env.FaasEnv,
      Qualifier: '$LATEST' // process.env.FaasEnv
    }, (options) || {})).then(function (res) {
      if (res.Result.ErrMsg) return Promise.reject(Error(res.Result.ErrMsg)); else if (typeof res.Result.RetMsg !== 'undefined')
        try {
          return JSON.parse(res.Result.RetMsg)
        } catch (error) {
          return res.Result.RetMsg
        }
      else return res
    })
}

export async function invokeSyncCloudFunction<TResult = any> (tc: Tencentcloud, name: string, data?: { [key: string]: any }, options?: {
  [key: string]: any
}): Promise<TResult> {
  if (options == null) options = {}
  options.InvocationType = 'RequestResponse'
  return invokeCloudFunction<TResult>(tc, name, data, options)
}
