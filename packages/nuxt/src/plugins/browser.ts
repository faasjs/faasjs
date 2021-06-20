import FaasBrowserClient, { Response } from '@faasjs/browser';
import { Context } from '@nuxt/types';

declare module 'vue/types/vue' {
  interface Vue {
    $faas(action: string, params?: any): Promise<Response>
  }
}

let browser: FaasBrowserClient;

export default function (ctx: Context, inject: (...args: any) => any): void {
  if (!browser) browser = new FaasBrowserClient('<%= options.baseUrl %>');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  inject('faas', async function (action: string, body?: any) {
    return browser.action(action, body);
  });
}
