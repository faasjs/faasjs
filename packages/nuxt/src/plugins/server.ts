import { Context } from '@nuxt/types';
import { Response } from '@faasjs/browser';
import FaasServerClient from '../server';

declare module 'vue/types/vue' {
  interface Vue {
    $faas(action: string, params?: any): Promise<Response>;
  }
}

declare module '@nuxt/types' {
  interface Context {
    $faas(action: string, params?: any): Promise<Response>;
  }
}

let server: FaasServerClient;

export default (ctx: Context, inject: any) => {
  server = new FaasServerClient('<%= options.baseUrl %>', ctx);
  inject('faas', function (action: string, body?: any) {
    return server.action(ctx, action, body);
  });
};
