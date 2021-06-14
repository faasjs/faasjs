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
  onError?(action: string, params: any): (res: any) => any;
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
    useFaas<T = any> (action: string, params?: Params) {
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
          .catch(e => {
            if (onError) onError(action, params)(e);
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
