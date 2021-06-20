import _Vue from 'vue';
import FaasBrowserClient, { Response, Options as FaasOptions } from '@faasjs/browser';

declare module 'vue/types/vue' {
  interface Vue {
    $faas: (action: string, params?: any) => Promise<Response>
  }
}

export interface Options {
  domain: string
  options?: FaasOptions
}

export default {
  install (Vue: typeof _Vue, options: Options): void {
    const client = new FaasBrowserClient(options.domain, options.options);
    Vue.prototype.$faas = async function<T = any> (action: string, params?: any) {
      return client.action<T>(action, params);
    };
  }
};
