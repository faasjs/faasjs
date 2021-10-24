import FaasBrowserClient, { Response, Options as FaasOptions } from '../../browser/src'

export type faas = <T = any>(action: string, params?: any) => Promise<Response<T>>

declare module 'vue/types/vue' {
  interface Vue {
    $faas: faas
  }
}

export interface Options {
  domain: string
  options?: FaasOptions
}

export const FaasVuePlugin = {
  install (Vue: any, options: Options): void {
    const client = new FaasBrowserClient(options.domain, options.options)
    Vue.prototype.$faas = async function<T = any> (action: string, params?: any) {
      return client.action<T>(action, params)
    }
  }
}
