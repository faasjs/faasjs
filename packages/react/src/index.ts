import Client, { Options, Params, Response, ResponseError } from '@faasjs/browser';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useState, useEffect } = require('react');

export function FaasClient ({
  domain,
  options,
  onError
}: {
  domain: string
  options?: Options
  onError?: (action: string, params: Params) => (res: ResponseError) => Promise<any>
}): {
    faas: <T = any>(action: string, params: Params) => Promise<Response<T>>
    useFaas: <T = any>(action: string, params: Params) => {
      loading: boolean
      data: T
      error: any
      promise: Promise<Response<T>>
    }
  } {
  const client = new Client(domain, options);

  return {
    async faas<T = any> (action: string, params: Params) {
      if (onError) return client.action<T>(action, params).catch(onError(action, params));
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
