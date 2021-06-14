// import { FaasClient } from '@faasjs/react';
import { v4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useState, useEffect } = require('react');
import Client, { Options, Params, Response } from '@faasjs/browser';

export function FaasClient ({
  domain,
  options,
  onError
}: {
  domain: string;
  options?: Options;
  onError?(action: string, params: any): (res: any) => Promise<any>;
}): {
    faas<T = any> (action: string, params: any): Promise<Response<T>>;
    useFaas<T = any> (action: string, params?: any): {
      loading: boolean;
      data: T;
      error: any;
      promise: Promise<Response<T>>
    }
  } {
  const client = new Client(domain, options);

  return {
    async faas<T = any> (action: string, params: Params) {
      if (onError) return client.action<T>(action, params, ).catch(onError(action, params));
      return client.action<T>(action, params);
    },
    useFaas<T = any> (action: string, params: Params) {
      const [loading, setLoading] = useState(false);
      const [data, setData] = useState();
      const [error, setError] = useState();
      const [promise, setPromise] = useState();

      useEffect(function () {
        setLoading(true);
        const request = client.action<T>(action, params);
        setPromise(request);
        request
          .then(r => {
            setData(r?.data);
          })
          .catch(async e => {
            if (onError)
              try {
                setData(await onError(action, params)(e));
              } catch (error) {
                setError(error);
              }

            setError(e);
          })
          .finally(() => setLoading(false));
      }, [action, JSON.stringify(params)]);

      return {
        loading,
        data,
        error,
        promise
      };
    }
  };
}


const client = FaasClient({
  domain: process.env.REACT_APP_API as string,
  options: {
    beforeRequest: function ({ action, xhr }) {
      if (action === 'token/create') return;
      xhr.setRequestHeader('XFaasToken', localStorage.getItem('accessToken')!);
    }
  },
  onError (action, params) {
    return async function (res) {
      console.log(res.status);
      if (res.status === 401) {
        // 检查设备编号是否生成
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
          deviceId = v4();
          localStorage.setItem('deviceId', deviceId);
        }

        // 获取公钥
        const keys = await faas<{
          version: string;
          accessToken: string;
          refreshToken: string;
        }>('token/create', {
          deviceId,
          version: '1.0'
        });

        localStorage.setItem('accessToken', keys.data.accessToken);
        localStorage.setItem('refreshToken', keys.data.refreshToken);

        return faas(action, params);
      }
    };
  }
});

export const faas = client.faas;
export const useFaas = client.useFaas;
