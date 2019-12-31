import FaasBrowserClient, { Response } from '@faasjs/browser';

declare module 'vue/types/vue' {
  interface Vue {
    $faas(action: string, params?: any): Promise<Response>;
  }
}

let browser: FaasBrowserClient;

export default (ctx: any, inject: any) => {
  if (!browser) {
    browser = new FaasBrowserClient('<%= options.baseUrl %>');
  }
  inject('faas', function (action: string, body?: any) {
    return browser.action(action, body);
  });
};
