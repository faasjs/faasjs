import {
  FaasBrowserClient, Response, Options
} from '../../browser/src'

export type {
  FaasBrowserClient, Options, Params, Response, ResponseHeaders, ResponseError
} from '../../browser/src'

export type faas = <T = any>(action: string, params?: any) => Promise<Response<T>>

declare module 'vue/types/vue' {
  interface Vue {
    $faas: faas
  }
}

export interface FaasVuePluginOptions {
  domain: string
  options?: Options
}

export const FaasVuePlugin = {
  install (Vue: any, options: FaasVuePluginOptions): void {
    const client = new FaasBrowserClient(options.domain, options.options)
    Vue.prototype.$faas = async function<T = any> (action: string, params?: any) {
      return client.action<T>(action, params)
    }
  }
}
