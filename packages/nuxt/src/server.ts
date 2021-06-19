/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import request, { Response as RequestResponse } from '@faasjs/request';
import { Response, ResponseError } from '@faasjs/browser';
import { Context } from '@nuxt/types';

export default class FaasServerClient {
  public readonly host: string;

  /**
   * 创建 FaasJS 浏览器客户端
   * @param baseUrl {string} 网关地址，非开发环境下有效
   */
  constructor (baseUrl: string, ctx: Context) {
    if (ctx.isDev)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.host = `http://${ctx.req.headers.host as string}/_faas/`;
    else
      this.host = baseUrl.endsWith('/') ? baseUrl : (baseUrl + '/');

    console.log('[faas][server] host:', this.host);
  }

  /**
   * 发起操作
   * @param action {string} 动作名称
   * @param body {any} 动作参数
   */
  public async action (ctx: Context, action: string, body?: { [key: string]: any; }): Promise<Response> {
    const url = this.host + action;
    const headers = Object.assign(JSON.parse(JSON.stringify(ctx.req.headers)), { 'Content-Type': 'application/json' });
    // 避免与url的host冲突，删除 host
    delete headers.host;

    if (headers['set-cookie']) {
      headers.cookie = headers['set-cookie'][0];
      delete headers.cookie;
    }
    console.log('[faas][server] action:', url, headers);

    return request(url, {
      headers,
      method: 'POST',
      body: typeof body !== 'string' ? JSON.stringify(body) : body,
    }).then(function (res: RequestResponse) {
      // 若有 set-cookie 则写入到 ctx.res
      if (res.headers && res.headers['set-cookie'] && Array.isArray(res.headers['set-cookie'])) {
        const cookies = [];
        for (let cookie of res.headers['set-cookie']) {
          // 在开发模式下修改 cookie 的 domain
          if (ctx.isDev)
            if (ctx.req.headers.host) {
              // 若有 host 信息，则修改为当前 host 的根域名
              const host = ctx.req.headers.host.split('.');
              cookie = cookie.replace(/domain=[^;]+;/, `domain=${host[host.length - 2]}.${host[host.length - 1]};`);
            } else
              // 没有 host 信息则直接删除 domain 配置
              cookie = cookie.replace(/domain=[^;]+;/, '');


          cookies.push(cookie);
        }

        ctx.res.setHeader('Set-Cookie', cookies);
      }
      return new Response({
        status: res.statusCode,
        headers: res.headers as {
          [key: string]: string;
        },
        data: res.body.data
      });
    }).catch(async function (err: Error) {
      console.error('[faas][server] error:', err);
      return Promise.reject(new ResponseError({
        message: err.message,
        status: 500,
        headers: {},
        body: null
      }));
    });
  }
}
