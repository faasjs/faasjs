import request from '@faasjs/request';
import scf from './scf';
import Tencentcloud from '..';

export function invokeCloudFunction (this: Tencentcloud, name: string, data?: any, options?: {
  [key: string]: any;
}) {
  this.logger.debug('invokeFunction: %s %o', name, options);

  if (process.env.FaasMode === 'local' && process.env.FaasLocal) {
    return request(process.env.FaasLocal + '/' + name, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      method: 'POST'
    });
  } else {
    return scf.call(this, Object.assign({
      Action: 'Invoke',
      FunctionName: name.replace(/[^a-zA-Z0-9-_]/g, '_'),
      ClientContext: JSON.stringify(data),
      InvocationType: 'Event',
      Namespace: process.env.FaasEnv,
      Qualifier: process.env.FaasEnv
    }, options || {})).then(function (res) {
      if (res.Result.ErrMsg) {
        return Promise.reject(Error(res.Result.ErrMsg));
      } else if (res.Result.RetMsg) {
        try {
          return JSON.parse(res.Result.RetMsg);
        } catch (error) {
          return res.Result.RetMsg;
        }
      } else {
        return res;
      }
    });
  }
}

export function invokeSyncCloudFunction (this: Tencentcloud, name: string, data?: any, options?: {
  [key: string]: any;
}) {
  if (!options) {
    options = {};
  }
  options.InvocationType = 'RequestResponse';
  return invokeCloudFunction.call(this, name, data, options);
}
