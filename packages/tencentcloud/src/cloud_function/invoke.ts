import { scf } from './scf'
import { Provider } from '..'

export async function invokeCloudFunction<TResult = any>(
  tc: Provider,
  name: string,
  data?: { [key: string]: any },
  options?: {
    [key: string]: any
  }
): Promise<TResult> {
  tc.logger.debug('invokeFunction: %s %j %j', name, options, data)

  return scf(
    'Invoke',
    tc.config,
    Object.assign(
      {
        FunctionName: name.replace(/[^a-zA-Z0-9-_]/g, '_'),
        ClientContext: JSON.stringify(data),
        InvocationType: 'Event',
        Namespace: process.env.FaasEnv,
        Qualifier: '$LATEST', // process.env.FaasEnv
      },
      options || {}
    )
  ).then(
    (res: {
      Result: {
        RetMsg: string
        ErrMsg: string
      }
    }) => {
      if (res.Result.ErrMsg) return Promise.reject(Error(res.Result.ErrMsg))
      try {
        return JSON.parse(res.Result.RetMsg)
      } catch (error) {
        return res.Result.RetMsg
      }
    }
  )
}

export async function invokeSyncCloudFunction<TResult = any>(
  tc: Provider,
  name: string,
  data?: { [key: string]: any },
  options?: {
    [key: string]: any
  }
): Promise<TResult> {
  if (!options) options = {}
  options.InvocationType = 'RequestResponse'
  return invokeCloudFunction<TResult>(tc, name, data, options)
}
