import { createServer, IncomingMessage } from 'http';
import * as URL from 'url';
import { parse } from 'querystring';
import { createHash } from 'crypto';
import Logger from '@faasjs/logger';
import { existsSync, readFileSync } from 'fs';
import { loadConfig, loadTs } from '@faasjs/load';
import { resolve, sep, join } from 'path';

interface Cache {
  handler?: any;
  file?: string;
  md5?: string;
}

/**
 * 本地服务端
 */
export class Server {
  public readonly root: string;
  public readonly logger: Logger;
  public readonly opts: {
    cache: boolean;
  }
  private cachedFuncs: {
    [path: string]: Cache;
  }

  /**
   * 创建本地服务器
   * @param root {string} 云函数的根目录
   * @param opts {object} 配置项
   * @param cache {boolean} 是否缓存云函数，默认为 false，每次接收请求都会重新编译和加载云函数代码
   */
  constructor (root: string, opts?: {
    cache: boolean;
  }) {
    this.root = root.endsWith(sep) ? root : root + sep;
    this.logger = new Logger('FaasJS');
    this.opts = Object.assign({ cache: false }, opts || {});
    this.cachedFuncs = {};
    this.logger.debug('init with %s %o', this.root, this.opts);
  }

  public async processRequest (req: IncomingMessage, res: {
    statusCode: number;
    write: (body: string | Buffer) => void;
    end: () => void;
    setHeader: (key: string, value: string) => void;
  }): Promise<void> {
    this.logger.info('[Request] %s', req.url);

    // 提取 path
    let path = join(this.root, req.url).replace(/\?.*/, '');

    // 读取或创建缓存
    const cache: Cache = this.cachedFuncs[path] || {};

    // 检查缓存是否可以使用
    if (this.cachedFuncs[path] && cache.handler)
      // 若配置 cache 为 true，则不进行 md5 校验，直接使用缓存
      if (this.opts.cache) {
        this.logger.info('[Response] cached: %s', cache.file);
      } else {
        // 校验 md5 确认文件是否被修改
        const md5 = createHash('md5').update(readFileSync(cache.file).toString()).digest('hex');
        if (md5 === cache.md5)
          this.logger.info('[Response] cached: %s', cache.file);
        else
          delete cache.handler;
      }
    else
      this.cachedFuncs[path] = cache;

    if (!cache.handler) {
      // 寻找云函数文件
      if (existsSync(path + '.func.ts'))
        path += '.func.ts';
      else
      if (existsSync(path + '/index.func.ts'))
        path += '/index.func.ts';
      else {
        const body = `Not found: ${path}.func.ts or ${path}/index.func.ts`;
        this.logger.info(body);

        res.statusCode = 404;
        res.write(body);
        res.end();
        return Promise.resolve();
      }

      // 将文件路径和 md5 写入缓存
      cache.file = resolve('.', path);
      cache.md5 = createHash('md5').update(readFileSync(cache.file).toString()).digest('hex');

      this.logger.info('[Response] %s', cache.file);
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      let func;
      if (!cache.handler)
        // 先直接引用 ts 文件，若非 ts 运行时，则编译成 js 再引用
        try {
          // 删除 require 缓存
          if (!this.opts.cache && require.cache[cache.file]) delete require.cache[cache.file];

          // 直接 require ts 文件
          func = require(cache.file).default;
        } catch (error) {
          this.logger.error(error);
          // 删除 require 缓存
          if (require.cache[cache.file + '.tmp.js']) delete require.cache[cache.file + '.tmp.js'];

          // 载入 ts 文件
          try {
            const ts = await loadTs(cache.file, { tmp: true });
            func = ts.module;
          } catch (error) {
            this.logger.error(error);
            res.statusCode = 500;
            res.write(error.message);
            res.end();
            return reject(error);
          }
        }

      const requestId = new Date().getTime().toString();
      try {
        if (!cache.handler) {
          // 读取云函数配置并写入缓存
          func.config = loadConfig(this.root, path)[process.env.FaasEnv];
          cache.handler = func.export().handler;
        }

        let body = '';

        req.on('readable', function () {
          body += req.read() || '';
        });

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        req.on('end', async () => {
          const uri = URL.parse(req.url);

          let data;
          try {
            data = await cache.handler({
              headers: req.headers,
              httpMethod: req.method,
              queryString: parse(uri.query || ''),
              path: req.url,
              body,
              requestContext: {
                httpMethod: req.method,
                identity: {},
                path: req.url,
                sourceIp: req.connection.remoteAddress
              }
            }, { request_id: requestId });
          } catch (error) {
            data = error;
          }

          if (data instanceof Error || (data && data.constructor && data.constructor.name === 'Error')) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('X-SCF-RequestId', requestId);
            res.write(JSON.stringify({ error: { message: data.message } }));
          } else {
            if (data.statusCode) res.statusCode = data.statusCode;

            if (data.headers)
              for (const key in data.headers)
                if (Object.prototype.hasOwnProperty.call(data.headers, key))
                  res.setHeader(key, data.headers[key]);

            if (data.body) res.write(data.body);
          }
          res.end();
          resolve();
        });
      } catch (error) {
        this.logger.error(error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('X-SCF-RequestId', requestId);
        res.write(JSON.stringify({ error: { message: error.message } }));
        res.end();
        reject(error);
      }
    });
  }

  public listen (port: number = 3000) {
    this.logger.info('listen http://localhost:%s with %s', port, this.root);

    if (!process.env.FaasEnv && process.env.NODE_ENV === 'development') process.env.FaasEnv = 'development';

    process.env.FaasMode = 'local';
    process.env.FaasLocal = `http://localhost:${port}`;

    return createServer((req: IncomingMessage, res) => {
      this.processRequest(req, res);
    }).listen(port);
  }
}
