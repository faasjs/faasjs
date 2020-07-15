// eslint-disable-next-line @typescript-eslint/no-var-requires
const React = require('react');
import Client, { Response } from '@faasjs/browser';

export function FaasClient (options: { domain: string }): {
  faas<T = any> (action: string, params: any): Promise<Response<T>>;
  useFaas<T = any> (action: string, params?: any): {
    loading: boolean;
    data: T;
    error: any;
  }
} {
  const client = new Client(options.domain);

  return {
    async faas<T = any> (action: string, params: any) {
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
