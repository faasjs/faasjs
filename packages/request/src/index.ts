import * as http from 'http';
import * as https from 'https';
import { stringify } from 'querystring';
import * as URL from 'url';
import Logger from '@faasjs/logger';

const log = new Logger('request');

export interface Request {
  headers?: http.OutgoingHttpHeaders;
  method?: string;
  host?: string;
  path?: string;
  query?: http.OutgoingHttpHeaders;
  body?: any;
}

export interface Response {
  request?: Request;
  statusCode?: number;
  statusMessage?: string;
  headers: http.OutgoingHttpHeaders;
  body: any;
}

export interface RequestOptions {
  headers?: http.OutgoingHttpHeaders;
  method?: string;
  query?: http.OutgoingHttpHeaders;
  body?: any;
}

type Mock = (url: string, options: RequestOptions) => Promise<Response>;

let mock: Mock | null = null;

/**
 * 设置模拟请求
 * @param handler {function | null} 模拟函数，若设置为 null 则表示清除模拟函数
 */
export function setMock (handler: Mock | null) {
  mock = handler;
}

/**
 * 发起网络请求
 * @param {string} url 请求路径或完整网址
 * @param {object=} [options={}] 参数和配置
 * @param {string} [options.methd=GET] 请求方法
 * @param {object} [options.query={}] 请求参数，放置于 path 后，若需放置在 body 中，请使用 body 参数
 * @param {object} [options.headers={}] 请求头
 * @param {object=} options.body 请求体
 *
 * @returns {promise}
 */
export default function request (url: string, {
  headers,
  method,
  query,
  body,
}: RequestOptions = {
  headers: {},
  query: {},
}): Promise<Response> {
  log.debug('request %s %o', url, {
    body,
    headers,
    method,
    query,
  });

  if (mock) {
    return mock(url, {
      headers,
      method,
      query,
      body
    });
  }

  // 序列化 query
  if (query) {
    if (url.indexOf('?') < 0) {
      url += '?';
    } else if (url.substring(url.length - 1) !== '?') {
      url += '&';
    }
    url += stringify(query);
  }

  // 处理 URL 并生成 options
  const uri = URL.parse(url);
  const protocol = uri.protocol === 'https:' ? https : http;

  if (!uri.protocol) throw Error('Unkonw protocol');

  const options: {
    method: string;
    headers: http.OutgoingHttpHeaders;
    query: http.OutgoingHttpHeaders;
    host?: string;
    path: string;
    port: string;
  } = {
    headers: {},
    host: uri.host ? uri.host.replace(/:[0-9]+$/, '') : uri.host,
    method: method ? method.toUpperCase() : 'GET',
    path: uri.path!,
    query: {},
    port: uri.port!
  };

  // 处理 headers
  for (const key in headers) {
    if (typeof headers[key as string] !== 'undefined' && headers[key as string] !== null) {
      options.headers[key as string] = headers[key as string];
    }
  }

  // 序列化 body
  if (body && typeof body !== 'string') {
    if (
      options.headers['Content-Type'] &&
      options.headers['Content-Type']!.toString().includes('application/x-www-form-urlencoded')
    ) {
      body = stringify(body);
    } else {
      body = JSON.stringify(body);
    }
  }

  if (body && !options.headers['Content-Length']) {
    options.headers['Content-Length'] = Buffer.byteLength(body);
  }

  return new Promise(function (resolve, reject) {
    // 包裹请求
    const req = protocol.request(options, function (res) {
      const raw: Buffer[] = [];
      res.on('data', (chunk) => {
        raw.push(chunk);
      });
      res.on('end', async () => {
        const data = Buffer.concat(raw).toString();
        log.timeEnd(url, 'response %s %s %s', res.statusCode, res.headers['content-type'], data);

        const response = Object.create(null);
        response.request = options;
        response.request.body = body;
        response.statusCode = res.statusCode;
        response.statusMessage = res.statusMessage;
        response.headers = res.headers;
        response.body = data;

        if (response.body && response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
          try {
            response.body = JSON.parse(response.body);
            log.debug('response.parse JSON');
          } catch (error) {
            console.error(error);
          }
        }

        if (response.statusCode >= 200 && response.statusCode < 400) {
          resolve(response);
        } else {
          log.debug('response.error %o', response);
          reject(response);
        }
      });
    });

    if (body) {
      req.write(body);
    }

    req.on('error', function (e) {
      log.timeEnd(url, 'response.error %o', e);
      reject(e);
    });

    // 发送请求
    log.time(url);
    req.end();
  });
}
