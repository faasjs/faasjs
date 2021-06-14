import { Cookie } from './cookie';
import { Session } from './session';
import Logger from '@faasjs/logger';
import { HttpError } from '.';

export type ValidatorRuleOptions = {
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  in?: any[];
  default?: any;
  config?: Partial<ValidatorOptions>;
}

export type ValidatorOptions = {
  whitelist?: 'error' | 'ignore';
  rules: {
    [key: string]: ValidatorRuleOptions;
  };
  onError?: (type: string, key: string | string[], value?: any) => {
    statusCode?: number;
    message: any;
  } | void;
}

type Request<P, C, S> = {
  headers: {
    [key: string]: string;
  }
  params?: P;
  cookie?: Cookie<C, S>;
  session?: Session<S, C>;
};

export type BeforeOption<P = any, C = any, S = any> = (request: Request<P, C, S>) => Promise<void | {
  statusCode?: number;
  message: string;
}>

export type ValidatorConfig = {
  params?: ValidatorOptions;
  cookie?: ValidatorOptions;
  session?: ValidatorOptions;
  before?: BeforeOption;
}

export class Validator<P, C, S> {
  public before?:BeforeOption<P, C, S>;
  public paramsConfig?: ValidatorOptions;
  public cookieConfig?: ValidatorOptions;
  public sessionConfig?: ValidatorOptions;
  private request: Request<P, C, S>;
  private logger: Logger;

  constructor (config: {
    params?: ValidatorOptions;
    cookie?: ValidatorOptions;
    session?: ValidatorOptions;
    before?: BeforeOption<P, C, S>;
  }) {
    this.paramsConfig = config.params;
    this.cookieConfig = config.cookie;
    this.sessionConfig = config.session;
    this.before = config.before;
    this.logger = new Logger('Http.Validator');
  }

  public async valid (request: Request<P, C, S>): Promise<void> {
    this.logger.debug('Begin');

    if (this.before) {
      const result = await this.before(request);

      if (result)
        throw new HttpError(result);
    }

    this.request = request;

    if (this.paramsConfig) {
      this.logger.debug('Valid params');
      this.validContent('params', request.params, '', this.paramsConfig);
    }

    if (this.cookieConfig) {
      this.logger.debug('Valid cookie');
      if (!request.cookie)
        throw Error('Not found Cookie');

      this.validContent('cookie', request.cookie.content, '', this.cookieConfig);
    }

    if (this.sessionConfig) {
      this.logger.debug('Valid Session');
      if (!request.session)
        throw Error('Not found Session');

      this.validContent('session', request.session.content, '', this.sessionConfig);
    }
  }

  public validContent (type: string, params: {
    [key: string]: any;
  }, baseKey: string, config: ValidatorOptions): void {
    if (config.whitelist) {
      const paramsKeys = Object.keys(params);
      const rulesKeys = Object.keys(config.rules);
      const diff = paramsKeys.filter(k => !rulesKeys.includes(k));
      if (diff.length)
        if (config.whitelist === 'error') {
          const diffKeys = diff.map(k => `${baseKey}${k}`);
          const error = Error(`[${type}] Unpermitted keys: ${diffKeys.join(', ')}`);
          if (config.onError) {
            const res = config.onError(`${type}.whitelist`, baseKey, diffKeys);
            if (res)
              throw new HttpError(res);
          }
          throw error;
        } else if (config.whitelist === 'ignore')
          for (const key of diff)
            delete params[key];
    }
    for (const key in config.rules) {
      const rule = config.rules[key];
      let value = params[key];

      // default
      if (rule.default)
        if (type === 'cookie' || type === 'session')
          this.logger.warn('Cookie and Session not support default rule.');
        else if (typeof value === 'undefined' && rule.default) {
          value = typeof rule.default === 'function' ? rule.default(this.request) : rule.default;
          params[key] = value;
        }


      // required
      if (rule.required === true)
        if (typeof value === 'undefined' || value === null) {
          const error = Error(`[${type}] ${baseKey}${key} is required.`);
          if (config.onError) {
            const res = config.onError(`${type}.rule.required`, `${baseKey}${key}`, value);
            if (res)
              throw new HttpError(res);
          }
          throw error;
        }


      if (typeof value !== 'undefined' && value !== null) {
        // type
        if (rule.type)
          if (type === 'cookie')
            this.logger.warn('Cookie not support type rule');
          else {
            let typed = true;
            switch (rule.type) {
              case 'array':
                typed = Array.isArray(value);
                break;
              case 'object':
                typed = Object.prototype.toString.call(value) === '[object Object]';
                break;
              default:
                typed = typeof value === rule.type;
                break;
            }

            if (!typed) {
              const error = Error(`[${type}] ${baseKey}${key} must be a ${rule.type}.`);
              if (config.onError) {
                const res = config.onError(`${type}.rule.type`, `${baseKey}${key}`, value);
                if (res)
                  throw new HttpError(res);
              }
              throw error;
            }
          }


        // in
        if (rule.in && !rule.in.includes(value)) {
          const error = Error(`[${type}] ${baseKey}${key} must be in ${rule.in.join(', ')}.`);
          if (config.onError) {
            const res = config.onError(`${type}.rule.in`, `${baseKey}${key}`, value);
            if (res)
              throw new HttpError(res);
          }
          throw error;
        }

        // nest config
        if (rule.config)
          if (type === 'cookie')
            this.logger.warn('Cookie not support nest rule.');
          else
          if (Array.isArray(value))
          // array
            for (const val of value)
              this.validContent(type, val, (baseKey ? `${baseKey}.${key}.` : `${key}.`), rule.config as ValidatorOptions);

          else if (typeof value === 'object')
          // object
            this.validContent(type, value, (baseKey ? `${baseKey}.${key}.` : `${key}.`), rule.config as ValidatorOptions);
      }
    }
  }
}
