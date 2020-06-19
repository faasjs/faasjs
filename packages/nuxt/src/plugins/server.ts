import { Context } from '@nuxt/types';
import { ServerResponse } from 'http';
import { IncomingMessage } from 'connect';
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
    isDev: boolean;
    req: IncomingMessage;
    res: ServerResponse;
  }
}

let server: FaasServerClient;

export default (ctx: Context, inject: any) => {
  server = new FaasServerClient('<%= options.baseUrl %>', ctx);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  inject('faas', async function (action: string, body?: any) {
    return server.action(ctx, action, body);
  });
};
