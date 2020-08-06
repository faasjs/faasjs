import { Plugin, InvokeData, MountData, DeployData, Next, usePlugin } from '@faasjs/func';
import deepMerge from '@faasjs/deep_merge';
import Logger from '@faasjs/logger';
import { Cookie, CookieOptions } from './cookie';
import { Session, SessionOptions } from './session';
import { Validator, ValidatorOptions, ValidatorRuleOptions } from './validator';

export { Cookie, CookieOptions, Session, SessionOptions, Validator, ValidatorOptions, ValidatorRuleOptions };

export const ContentType: {
  [key: string]: string;
} = {
  plain: 'text/plain',
  html: 'text/html',
  xml: 'application/xml',
  csv: 'text/csv',
  css: 'text/css',
  javascript: 'application/javascript',
  json: 'application/json',
  jsonp: 'application/javascript'
};

export interface HttpConfig {
  [key: string]: any;
  name?: string;
  config?: {
    [key: string]: any;
    method?: 'BEGIN' | 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'PUT' | 'OPTIONS' | 'TRACE' | 'PATCH' | 'ANY';
    timeout?: number;
    path?: string;
    ignorePathPrefix?: string;
    functionName?: string;
    cookie?: CookieOptions;
  };
  validator?: {
    params?: ValidatorOptions;
    cookie?: ValidatorOptions;
    session?: ValidatorOptions;
  };
}

export interface Response {
  statusCode?: number;
  headers: {
    [key: string]: any;
  };
  body?: string;
}

const Name = 'http';

const globals: {
  [name: string]: Http;
} = {};

export class Http<P = any, C = {[key: string]: string}, S = {[key: string]: any}> implements Plugin {
  public readonly type: string = Name;
  public readonly name: string = Name;
  public headers: {
    [key: string]: string;
  };
  public params: P;
  public cookie: Cookie<C, S>;
  public session: Session<S, C>;
  public config: HttpConfig;
  private validatorOptions?: {
    params?: ValidatorOptions;
    cookie?: ValidatorOptions;
    session?: ValidatorOptions;
  };
  private response?: Response;
  private validator?: Validator<P, C, S>;
  private logger: Logger;

  /**
   * 创建 Http 插件实例
   * @param config {object} 配置项
   * @param config.name {string} 配置名
   * @param config.config {object} 网关配置
   * @param config.config.method {string} 请求方法，默认为 POST
   * @param config.config.path {string} 请求路径，默认为云函数文件路径
   * @param config.config.ignorePathPrefix {string} 排除的路径前缀，当设置 path 时无效
   * @param config.config.cookie {object} Cookie 配置
   * @param config.validator {object} 入参校验配置
   * @param config.validator.params {object} params 校验配置
   * @param config.validator.params.whitelist {string} 白名单配置
   * @param config.validator.params.onError {function} 自定义报错
   * @param config.validator.params.rules {object} 参数校验规则
   * @param config.validator.cookie {object} cookie 校验配置
   * @param config.validator.cookie.whitelist {string} 白名单配置
   * @param config.validator.cookie.onError {function} 自定义报错
   * @param config.validator.cookie.rules {object} 参数校验规则
   * @param config.validator.session {object} session 校验配置
   * @param config.validator.session.whitelist {string} 白名单配置
   * @param config.validator.session.onError {function} 自定义报错
   * @param config.validator.session.rules {object} 参数校验规则
   */
  constructor (config?: HttpConfig) {
    this.name = config?.name || this.type;
    this.config = config?.config || Object.create(null);
    if (config?.validator)
      this.validatorOptions = config.validator;
    this.logger = new Logger(this.name);

    this.headers = Object.create(null);
    this.cookie = new Cookie(this.config.cookie || {});
    this.session = this.cookie.session;
  }

  public async onDeploy (data: DeployData, next: Next): Promise<void> {
    await next();

    this.logger.debug('组装网关配置');
    this.logger.debug('%o', data);

    const config = deepMerge(data.config.plugins[this.name || this.type], { config: this.config });

    // 根据文件及文件夹名生成路径
    if (!config.config.path) {
      config.config.path = '=/' + data.name.replace(/_/g, '/').replace(/\/index$/, '');
      if (config.config.ignorePathPrefix) {
        config.config.path = config.config.path.replace(new RegExp('^=' + config.config.ignorePathPrefix), '=');
        if (config.config.path === '=') config.config.path = '=/';
      }
    }

    this.logger.debug('组装完成 %o', config);

    // 引用服务商部署插件
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const Provider = require(config.provider.type);
    const provider = new Provider(config.provider.config);

    // 部署网关
    await provider.deploy(this.type, data, config);
  }

  public async onMount (data: MountData, next: Next): Promise<void> {
    this.logger.debug('[onMount] merge config');
    if (data.config.plugins[this.name || this.type])
      this.config = deepMerge(this.config, data.config.plugins[this.name || this.type].config);

    this.logger.debug('[onMount] prepare cookie & session');
    this.cookie = new Cookie(this.config.cookie || {});
    this.session = this.cookie.session;

    if (this.validatorOptions) {
      this.logger.debug('[onMount] prepare validator');
      this.validator = new Validator<P, C, S>(this.validatorOptions);
    }

    globals[this.name] = this;

    await next();
  }

  public async onInvoke (data: InvokeData, next: Next): Promise<void> {
    this.headers = data.event.headers || Object.create(null);
    this.params = Object.create(null);
    this.response = { headers: Object.create(null) };

    if (data.event.body)
      if (data.event.headers && data.event.headers['content-type'] && data.event.headers['content-type'].includes('application/json')) {
        this.logger.debug('[onInvoke] Parse params from json body');
        this.params = JSON.parse(data.event.body);
      } else {
        this.logger.debug('[onInvoke] Parse params from raw body');
        this.params = data.event.body;
      }
    else if (data.event.queryString) {
      this.logger.debug('[onInvoke] Parse params from queryString');
      this.params = data.event.queryString;
    }

    this.logger.debug('[onInvoke] Parse cookie');
    this.cookie.invoke(this.headers['cookie']);
    this.logger.debug('[onInvoke] Cookie: %O', this.cookie.content);
    this.logger.debug('[onInvoke] Session: %O', this.session.content);

    if (this.validator) {
      this.logger.debug('[onInvoke] Valid request');
      try {
        this.validator.valid({
          params: this.params,
          cookie: this.cookie,
          session: this.session
        });
      } catch (error) {
        this.logger.error(error);
        data.response = {
          statusCode: error.statusCode || 500,
          headers: Object.assign({
            'Content-Type': 'application/json; charset=utf-8',
            'X-SCF-RequestId': data.context.request_id
          }, error.headers || {}),
          body: JSON.stringify({ error: { message: error.message } })
        };
        return;
      }
    }

    try {
      await next();
    } catch (error) {
      data.response = error;
    }

    // update seesion
    this.session.update();

    // 处理 body
    if (data.response)
      if (data.response instanceof Error || (data.response.constructor && data.response.constructor.name === 'Error')) {
        // 当结果是错误类型时
        this.logger.error(data.response);
        this.response.body = JSON.stringify({ error: { message: data.response.message } });
        this.response.statusCode = 500;
      } else if (Object.prototype.toString.call(data.response) === '[object Object]' && data.response.statusCode && data.response.headers)
        // 当返回结果是响应结构体时
        this.response = data.response;
      else
        this.response.body = JSON.stringify({ data: data.response });


    // 处理 statusCode
    if (!this.response.statusCode)
      this.response.statusCode = this.response.body ? 200 : 201;

    // 处理 headers
    this.response.headers = Object.assign({
      'Content-Type': 'application/json; charset=utf-8',
      'X-SCF-RequestId': data.context.request_id
    }, this.cookie.headers(), this.response.headers);

    data.response = this.response;
  }

  /**
   * 设置 header
   * @param key {string} key
   * @param value {*} value
   */
  public setHeader (key: string, value: any): Http {
    this.response.headers[key] = value;
    return this;
  }

  /**
   * 设置 Content-Type
   * @param type {string} 类型
   * @param charset {string} 编码
   */
  public setContentType (type: string, charset: string = 'utf-8'): Http {
    if (ContentType[type])
      this.setHeader('Content-Type', `${ContentType[type]}; charset=${charset}`);
    else
      this.setHeader('Content-Type', `${type}; charset=${charset}`);
    return this;
  }

  /**
   * 设置状态码
   * @param code {number} 状态码
   */
  public setStatusCode (code: number): Http {
    this.response.statusCode = code;
    return this;
  }

  /**
   * 设置 body
   * @param body {*} 内容
   */
  public setBody (body: string): Http {
    this.response.body = body;
    return this;
  }
}

export function useHttp<P = any, C = {[key: string]: string}, S = {[key: string]: any}> (config?: HttpConfig): Http<P, C, S> {
  const name = config?.name || Name;

  if (globals[name]) return usePlugin(globals[name] as Http<P, C, S>);

  return usePlugin(new Http<P, C, S>(config));
}
