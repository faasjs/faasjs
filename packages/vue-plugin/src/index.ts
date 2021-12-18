import { FaasBrowserClient, Options } from '@faasjs/browser'

export type {
  FaasBrowserClient, Options, Response, ResponseHeaders, ResponseError
} from '@faasjs/browser'

export interface FaasVuePluginOptions {
  domain: string
  options?: Options
}

export const FaasVuePlugin = {
  install (Vue: any, options: FaasVuePluginOptions): void {
    const client = new FaasBrowserClient(options.domain, options.options)
    Vue.prototype.$faas = client.action
  }
}
