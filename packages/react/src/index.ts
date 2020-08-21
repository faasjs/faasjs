// eslint-disable-next-line @typescript-eslint/no-var-requires
const React = require('react');
import Client, { Response } from '@faasjs/browser';

export function FaasClient ({
  domain,
  onError
}: {
  domain: string;
  onError?(action: string, params: any): (res: any) => any;
}): {
    faas<T = any> (action: string, params: any): Promise<Response<T>>;
    useFaas<T = any> (action: string, params?: any): {
      loading: boolean;
      data: T;
      error: any;
    }
  } {
  const client = new Client(domain);

  return {
    async faas<T = any> (action: string, params: any) {
      if (onError) return client.action<T>(action, params).catch(onError(action, params));
      return client.action<T>(action, params);
    },
    useFaas<T = any> (action: string, params?: any) {
      const [loading, setLoading] = React.useState(false);
      const [data, setData] = React.useState();
      const [error, setError] = React.useState();

      React.useEffect(function () {
        setLoading(true);
        client.action<T>(action, params).then(r => {
          setData(r?.data);
        }).catch(e => {
          if (onError) onError(action, params)(e);
          setError(e);
        }).finally(() => setLoading(false));
      }, [action, JSON.stringify(params)]);

      return {
        loading,
        data,
        error
      };
    }
  };
}
