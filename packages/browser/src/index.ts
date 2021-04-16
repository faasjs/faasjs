export interface ResponseHeaders {
  [key: string]: string;
}

export class Response<T = any> {
  public readonly status: number;
  public readonly headers: ResponseHeaders;
  public readonly data: T;

  constructor ({ status, headers, data }: {
    status: number;
    headers: ResponseHeaders;
    data: T;
  }) {
    this.status = status;
    this.headers = headers;
    this.data = data;
  }
}

export class ResponseError extends Error {
  public readonly status: number;
  public readonly headers: ResponseHeaders
  public readonly body: any;

  constructor ({ message, status, headers, body }: {
    message: string; status: number; headers: ResponseHeaders; body: any;
  }) {
    super(message);

    this.status = status;
    this.headers = headers;
    this.body = body;
  }
}

export type action = (action: string, params?: any) => Promise<Response>;

export default class FaasBrowserClient {
  public host: string;

  /**
   * 创建 FaasJS 浏览器客户端
   * @param baseUrl {string=} 网关地址，若不填写，则默认为本地路径 /_faas/
   */
  constructor (baseUrl?: string) {
    if (baseUrl)
      this.host = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    else
      this.host = '/_faas/';

    console.debug('[faas] baseUrl: ' + this.host);
  }

  /**
   * 发起操作
   * @param action {string} 动作名称
   * @param params {any} 动作参数
   */
  public async action<T = any> (action: string, params?: any): Promise<Response<T>> {
    const url = this.host + action.toLowerCase() + '?_=' + new Date().getTime().toString();

    if (params && typeof params !== 'string')
      params = JSON.stringify(params);


    return new Promise(function (resolve, reject) {
      // eslint-disable-next-line no-undef
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.withCredentials = true;
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

      xhr.onload = function () {
        let res = xhr.response;
        const headersList = xhr.getAllResponseHeaders().trim().split(/[\r\n]+/);
        const headers: ResponseHeaders = {};
        headersList.forEach(function (line) {
          const parts = line.split(': ');
          const key = parts.shift();
          const value = parts.join(': ');
          headers[key] = value;
        });
        if (xhr.response && xhr.getResponseHeader('Content-Type') && xhr.getResponseHeader('Content-Type')!.includes('json'))
          try {
            res = JSON.parse(xhr.response);
            if (res.error && res.error.message)
              reject(new ResponseError({
                message: res.error.message,
                status: xhr.status,
                headers,
                body: res
              }));
          } catch (error) {
            console.error(error);
          }

        if (xhr.status >= 200 && xhr.status < 300)
          resolve(new Response({
            status: xhr.status,
            headers,
            data: res.data
          }));
        else {
          console.error(xhr, res);
          reject(new ResponseError({
            message: xhr.statusText || xhr.status.toString(),
            status: xhr.status,
            headers,
            body: res
          }));
        }
      };

      xhr.onerror = function () {
        reject(new ResponseError({
          message: 'Network Error',
          status: xhr.status,
          headers: {},
          body: null
        }));
      };

      xhr.send(params);
    });
  }
}
