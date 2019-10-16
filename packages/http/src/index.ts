import { Plugin, InvokeData, MountData, DeployData, Next } from '@faasjs/func';
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
  name?: string;
  config?: {
    method?: string;
    timeout?: number;
    functionName?: string;
    cookie?: CookieOptions;
    [key: string]: any;
  };
  validator?: {
    params?: ValidatorOptions;
    cookie?: ValidatorOptions;
    session?: ValidatorOptions;
  };
  [key: string]: any;
}

export interface Response {
  statusCode?: number;
  headers: {
    [key: string]: any;
  };
  body?: string;
}

export class Http implements Plugin {
  public readonly type: string;
  public name?: string
  public headers: {
    [key: string]: string;
  };
  public params: any;
  public cookie: Cookie;
  public session: Session;
  public config: {
    method?: number;
    timeout?: number;
    functionName?: string;
    cookie?: CookieOptions;
    [key: string]: any;
  };
  private validatorOptions?: {
    params?: ValidatorOptions;
    cookie?: ValidatorOptions;
    session?: ValidatorOptions;
  };
  private response?: Response;
  private validator?: Validator;
  private logger: Logger;

  /**
   * 创建 Http 插件实例
   * @param config {object} 配置项
   * @param config.name {string} 配置名
   * @param config.config {object} 网关配置
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
  constructor (config: HttpConfig = Object.create(null)) {
    this.logger = new Logger('Http');
    this.type = 'http';
    this.name = config.name;
    this.config = config.config || Object.create(null);
    if (config.validator) {
      this.validatorOptions = config.validator;
    }
    this.headers = Object.create(null);
    this.cookie = new Cookie(this.config.cookie || {});
    this.session = this.cookie.session;
  }

  public async onDeploy (data: DeployData, next: Next) {
    this.logger.debug('[Http] 组装网关配置');
    this.logger.debug('%o', data);

    const config = deepMerge(data.config!.plugins![this.name || this.type], { config: this.config });

    // 根据文件及文件夹名生成路径
    config.config.path = '/' + data.name!.replace(/_/g, '/').replace(/\/index$/, '');

    this.logger.debug('[Http] 组装完成 %o', config);

    // 引用服务商部署插件
    // eslint-disable-next-line security/detect-non-literal-require, @typescript-eslint/no-var-requires
    const Provider = require(config.provider.type);
    const provider = new Provider();

    // 部署网关
    await provider.deploy(this.type, data, config);

    await next();
  }

  public async onMount (data: MountData, next: Next) {
    this.logger.debug('[onMount] merge config');
    if (data.config.plugins[this.name || this.type]) {
      this.config = deepMerge(this.config, data.config.plugins[this.name || this.type].config);
    }

    this.logger.debug('[onMount] prepare cookie & session');
    this.cookie = new Cookie(this.config.cookie || {});
    this.session = this.cookie.session;

    if (this.validatorOptions) {
      this.logger.debug('[onMount] prepare validator');
      this.validator = new Validator(this.validatorOptions);
    }

    await next();
  }

  public async onInvoke (data: InvokeData, next: Next) {
    this.logger.debug('[onInvoke] Parse & valid');
    this.logger.time('http');

    this.headers = data.event.headers || Object.create(null);
    this.params = Object.create(null);
    this.response = {
      headers: Object.create(null)
    };

    if (data.event.body) {
      if (data.event.headers && data.event.headers['content-type'] && data.event.headers['content-type'].includes('application/json')) {
        this.logger.debug('[onInvoke] Parse params from json body');
        this.params = JSON.parse(data.event.body);
      } else {
        this.logger.debug('[onInvoke] Parse params from raw body');
        this.params = data.event.body;
      }
    } else if (data.event.queryString) {
      this.logger.debug('[onInvoke] Parse params from queryString');
      this.params = data.event.queryString;
    }

    this.logger.debug('[onInvoke] Parse cookie');
    this.cookie.invoke(this.headers['cookie']);
    this.logger.debug('[onInvoke] Cookie: %o', this.cookie.content);
    this.logger.debug('[onInvoke] Session: %o', this.session.content);

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
            'X-Request-Id': (data.context ? data.context.request_id : new Date().getTime().toString())
          }, error.headers || {}),
          body: JSON.stringify({
            error: {
              message: error.message
            }
          })
        };
        return;
      }
    }

    this.logger.timeEnd('http', '[onInvoke] Parse & valid done');

    await next();

    this.logger.debug('[onInvoke] Generate response');
    this.logger.time('http');

    // update seesion
    this.session.update();

    // 处理 body
    if (data.response) {
      if (data.response instanceof Error || data.response.constructor.name === 'Error') {
        // 当结果是错误类型时
        this.logger.error(data.response);
        this.response.body = JSON.stringify({ error: { message: data.response.message } });
        this.response.statusCode = 500;
      } else {
        this.response.body = JSON.stringify({ data: data.response });
      }
    }

    // 处理 statusCode
    if (!this.response.statusCode) {
      this.response.statusCode = this.response.body ? 200 : 201;
    }

    // 处理 headers
    this.response.headers = Object.assign({
      'Content-Type': 'application/json; charset=utf-8',
      'X-Request-Id': (data.context ? data.context.request_id : new Date().getTime().toString())
    }, this.cookie.headers(), this.response.headers);

    /* eslint-disable-next-line require-atomic-updates */
    data.response = this.response;

    this.logger.timeEnd('http', '[onInvoke] done');
  }

  /**
   * 设置 header
   * @param key {string} key
   * @param value {*} value
   */
  public setHeader (key: string, value: any) {
    this.response!.headers[key as string] = value;
    return this;
  }

  /**
   * 设置 Content-Type
   * @param type {string} 类型
   * @param charset {string} 编码
   */
  public setContentType (type: string, charset: string = 'utf-8') {
    if (ContentType[type as string]) {
      this.setHeader('Content-Type', `${ContentType[type as string]}; charset=${charset}`);
    } else {
      this.setHeader('Content-Type', `${type}; charset=${charset}`);
    }
    return this;
  }

  /**
   * 设置状态码
   * @param code {number} 状态码
   */
  public setStatusCode (code: number) {
    this.response!.statusCode = code;
    return this;
  }

  /**
   * 设置 body
   * @param body {*} 内容
   */
  public setBody (body: string) {
    this.response!.body = body;
    return this;
  }
}
