import { Cookie } from './cookie';
import { Session } from './session';
import Logger from '@faasjs/logger';

export interface ValidatorRuleOptions {
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  in?: any[];
  default?: any;
  config?: Partial<ValidatorOptions>;
}

export interface ValidatorOptions {
  whitelist?: 'error' | 'ignore';
  rules: {
    [key: string]: ValidatorRuleOptions;
  };
  onError?: (type: string, key: string | string[], value?: any) => {
    statusCode?: number;
    headers?: {
      [key: string]: any;
    };
    message: any;
  } | void;
}

class ValidError extends Error {
  public statusCode: number;
  public headers: {
    [key: string]: any;
  }

  constructor ({ statusCode, headers, message }: {
    statusCode?: number;
    headers?: {
      [key: string]: any;
    };
    message: string;
  }) {
    super(message);
    this.statusCode = statusCode || 500;
    this.headers = headers || Object.create(null);
  }
}

export class Validator {
  public paramsConfig?: ValidatorOptions;
  public cookieConfig?: ValidatorOptions;
  public sessionConfig?: ValidatorOptions;
  private request?: {
    params?: any;
    cookie?: Cookie;
    session?: Session;
  }
  private logger: Logger;

  constructor (config: {
    params?: ValidatorOptions;
    cookie?: ValidatorOptions;
    session?: ValidatorOptions;
  }) {
    this.paramsConfig = config.params;
    this.cookieConfig = config.cookie;
    this.sessionConfig = config.session;
    this.logger = new Logger('Http.Validator');
  }

  public valid ({
    params,
    cookie,
    session
  }:
  {
    params?: any;
    cookie?: Cookie;
    session?: Session;
  }) {
    this.request = {
      params,
      cookie,
      session
    };
    this.logger.debug('Begin');

    if (this.paramsConfig) {
      this.logger.debug('Valid params');
      this.validContent('params', params, '', this.paramsConfig);
    }

    if (this.cookieConfig) {
      this.logger.debug('Valid cookie');
      if (!cookie) {
        throw Error('Not found Cookie');
      }
      this.validContent('cookie', cookie.content, '', this.cookieConfig);
    }

    if (this.sessionConfig) {
      this.logger.debug('Valid Session');
      if (!session) {
        throw Error('Not found Session');
      }
      this.validContent('session', session.content, '', this.sessionConfig);
    }
  }

  public validContent (type: string, params: {
    [key: string]: any;
  }, baseKey: string, config: ValidatorOptions) {
    if (config.whitelist) {
      const paramsKeys = Object.keys(params);
      const rulesKeys = Object.keys(config.rules);
      const diff = paramsKeys.filter(k => !rulesKeys.includes(k));
      if (diff.length) {
        if (config.whitelist === 'error') {
          const diffKeys = diff.map(k => `${baseKey}${k}`);
          const error = Error(`[${type}] Unpermitted keys: ${diffKeys.join(', ')}`);
          if (config.onError) {
            const res = config.onError(`${type}.whitelist`, baseKey, diffKeys);
            if (res) {
              throw new ValidError(res);
            }
          }
          throw error;
        } else if (config.whitelist === 'ignore') {
          for (const key of diff) {
            delete params[key as string];
          }
        }
      }
    }
    for (const key in config.rules) {
      const rule = config.rules[key as string];
      let value = params[key as string];

      // default
      if (rule.default) {
        if (type === 'cookie' || type === 'session') {
          this.logger.warn('Cookie and Session not support default rule.');
        } else if (typeof value === 'undefined' && rule.default) {
          value = typeof rule.default === 'function' ? rule.default(this.request) : rule.default;
          params[key as string] = value;
        }
      }

      // required
      if (rule.required === true) {
        if (typeof value === 'undefined' || value === null) {
          const error = Error(`[${type}] ${baseKey}${key} is required.`);
          if (config.onError) {
            const res = config.onError(`${type}.rule.required`, `${baseKey}${key}`, value);
            if (res) {
              throw new ValidError(res);
            }
          }
          throw error;
        }
      }

      if (typeof value !== 'undefined' && value !== null) {
        // type
        if (rule.type) {
          if (type === 'cookie') {
            this.logger.warn('Cookie not support type rule');
          } else {
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
                if (res) {
                  throw new ValidError(res);
                }
              }
              throw error;
            }
          }
        }

        // in
        if (rule.in && !rule.in.includes(value)) {
          const error = Error(`[${type}] ${baseKey}${key} must be in ${rule.in.join(', ')}.`);
          if (config.onError) {
            const res = config.onError(`${type}.rule.in`, `${baseKey}${key}`, value);
            if (res) {
              throw new ValidError(res);
            }
          }
          throw error;
        }

        // nest config
        if (rule.config) {
          if (type === 'cookie') {
            this.logger.warn('Cookie not support nest rule.');
          } else {
            if (Array.isArray(value)) {
              // array
              for (const val of value) {
                this.validContent(type, val, (baseKey ? `${baseKey}.${key}.` : `${key}.`), rule.config as ValidatorOptions);
              }
            } else if (typeof value === 'object') {
              // object
              this.validContent(type, value, (baseKey ? `${baseKey}.${key}.` : `${key}.`), rule.config as ValidatorOptions);
            }
          }
        }
      }
    }
  }
}
