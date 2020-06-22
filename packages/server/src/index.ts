/* eslint-disable @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call */
import { createServer, IncomingMessage, Server as HttpServer } from 'http';
import * as URL from 'url';
import { parse } from 'querystring';
import Logger from '@faasjs/logger';
import { existsSync } from 'fs';
import { loadConfig } from '@faasjs/load';
import { resolve as pathResolve, sep, join } from 'path';
import { debounce } from 'lodash';

interface Cache {
  file?: string;
  handler?(...args: any): Promise<any>;
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
  private processing = false;
  private cachedFuncs: {
    [path: string]: Cache;
  }
  private clearCache: () => void;

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

    this.clearCache = debounce(function () {
      this.logger.debug('clear cache');
      Object.keys(require.cache).forEach(function (id) {
        if (!id.includes('/node_modules/'))
          delete require.cache[id];
      });
    }, 500);
  }

  public async processRequest (req: IncomingMessage, res: {
    statusCode: number;
    write: (body: string | Buffer) => void;
    end: () => void;
    setHeader: (key: string, value: string) => void;
  }): Promise<void> {
    this.logger.info('[Request] %s', req.url);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
    return new Promise((resolve, reject) => {
      const requestId = new Date().getTime().toString();
      try {
        let body = '';

        req.on('readable', function () {
          body += req.read() || '';
        });

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        req.on('end', async () => {
          let data;
          try {
            // 提取 path
            const path = join(this.root, req.url).replace(/\?.*/, '');

            let cache: Cache = {};

            if (this.opts.cache && this.cachedFuncs[path] && this.cachedFuncs[path].handler) {
              this.logger.info('[Response] cached: %s', cache.file);
              cache = this.cachedFuncs[path];
            } else {
              cache.file = pathResolve('.', this.getFilePath(path));
              this.logger.info('[Response] %s', cache.file);

              const func = require(cache.file).default;
              func.config = loadConfig(this.root, path)[process.env.FaasEnv || 'development'];
              // eslint-disable-next-line @typescript-eslint/unbound-method
              cache.handler = func.export().handler;

              if (this.opts.cache) this.cachedFuncs[path] = cache;
              else this.clearCache();
            }

            const uri = URL.parse(req.url);

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
                sourceIp: req.connection?.remoteAddress
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

  public listen (port: number = 3000): HttpServer {
    this.logger.info('listen http://localhost:%s with %s', port, this.root);

    if (!process.env.FaasEnv && process.env.NODE_ENV === 'development') process.env.FaasEnv = 'development';

    process.env.FaasMode = 'local';
    process.env.FaasLocal = `http://localhost:${port}`;

    return createServer(this.opts.cache ? this.processRequest.bind(this) : async (req, res)=> {
      if (!this.processing) {
        this.processing = true;
        await this.processRequest(req, res);
        this.processing = false;
      } else {
        const timer = setInterval(async ()=> {
          if (!this.processing) {
            this.processing = true;
            clearInterval(timer);
            await this.processRequest(req, res);
            this.processing = false;
          }
        });
      }
    }).listen(port, '0.0.0.0');
  }

  private getFilePath (path: string) {
    if (existsSync(path + '.func.ts'))
      return path + '.func.ts';
    else if (existsSync(path + '/index.func.ts'))
      return path + '/index.func.ts';

    throw Error(`Not found: ${path}.func.ts or ${path}/index.func.ts`);
  }
}
