/**
 * A Vue plugin for FaasJS.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/vue-plugin.svg)](https://github.com/faasjs/faasjs/blob/main/packages/vue-plugin/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/vue-plugin.svg)](https://www.npmjs.com/package/@faasjs/vue-plugin)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/vue-plugin
 * ```
 * @packageDocumentation
 */
import {
  type BaseUrl,
  FaasBrowserClient,
  type FaasBrowserClientAction,
  type Options,
} from '@faasjs/browser'
import 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $faas: FaasBrowserClientAction
  }
}

export type {
  FaasBrowserClient,
  Options,
  Response,
  ResponseHeaders,
  ResponseError,
} from '@faasjs/browser'

export type FaasVuePluginOptions = {
  baseUrl: BaseUrl
  options?: Options
}

export const FaasVuePlugin = {
  install(app: any, options: FaasVuePluginOptions): void {
    const client = new FaasBrowserClient(options.baseUrl, options.options)

    app.config.globalProperties.$faas = client.action
  },
}
