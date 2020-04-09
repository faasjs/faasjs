import Logger from '@faasjs/logger';
import RunHandler from './plugins/run_handler/index';

export type Handler = (data: InvokeData) => any;
export type Next = () => Promise<void>;
export type ExportedHandler = (event: any, context?: any, callback?: (...args: any) => any) => Promise<any>;

export interface Plugin {
  [key: string]: any;
  type: string;
  name?: string;
  onDeploy?: (data: DeployData, next: Next) => void;
  onMount?: (data: MountData, next: Next) => void;
  onInvoke?: (data: InvokeData, next: Next) => void;
}

export interface Config {
  [key: string]: any;
  providers: {
    [key: string]: {
      type: string;
      config: {
        [key: string]: any;
      };
    };
  };
  plugins: {
    [key: string]: {
      [key: string]: any;
      provider?: string;
      type: string;
      config?: {
        [key: string]: any;
      };
    };
  };
}
export interface DeployData {
  [key: string]: any;
  root: string;
  filename: string;
  env?: string;
  name?: string;
  config?: Config;
  version?: string;
  dependencies?: {
    [name: string]: string;
  };
  plugins?: {
    [name: string]: {
      [key: string]: any;
      name?: string;
      type: string;
      provider?: string;
      config: {
        [key: string]: any;
      };
      plugin: Plugin;
    };
  };
  logger?: Logger;
}

export interface MountData {
  [key: string]: any;
  config: Config;
  event: any;
  context: any;
}

export interface InvokeData {
  [key: string]: any;
  event: any;
  context: any;
  callback: any;
  response: any;
  logger: Logger;
  handler: Handler;
  config: Config;
}

export type LifeCycleKey = 'onDeploy' | 'onMount' | 'onInvoke';

export interface FuncConfig {
  plugins?: Plugin[];
  handler?: Handler;
}

interface CachedFunction {
  key: string;
  handler: (...args: any) => void;
}

export class Func {
  [key: string]: any;
  public plugins: Plugin[];
  public handler?: Handler;
  public logger: Logger;
  public config: Config;
  private mounted: boolean;
  private cachedFunctions: {
    [key in LifeCycleKey]: CachedFunction[];
  }

  /**
   * 新建流程
   * @param config {object} 配置项
   * @param config.plugins {Plugin[]} 插件
   * @param config.handler {Handler} 业务函数
   */
  constructor (config: FuncConfig) {
    this.logger = new Logger('Func');

    this.handler = config.handler;
    this.plugins = config.plugins || [];
    this.plugins.push(new RunHandler());
    this.config = {
      providers: Object.create(null),
      plugins: Object.create(null)
    };

    this.mounted = false;
    this.cachedFunctions = Object.create(null);
  }

  public compose (key: LifeCycleKey): (data: any, next?: () => void) => any {
    const logger = new Logger(key);
    let list: CachedFunction[] = [];

    if (this.cachedFunctions[key])
      list = this.cachedFunctions[key];
    else {
      for (const plugin of this.plugins)
        if (typeof plugin[key] === 'function')
          list.push({
            key: plugin.name,
            handler: plugin[key].bind(plugin)
          });

      this.cachedFunctions[key] = list;
    }

    return function (data: any, next?: () => void): any {
      let index = -1;

      const dispatch = async function (i: number): Promise<any> {
        if (i <= index) return Promise.reject(Error('next() called multiple times'));
        index = i;
        let fn: any = list[i];
        if (i === list.length) fn = next;
        if (!fn) return Promise.resolve();
        logger.debug(`[${fn.key}] begin`);
        logger.time(fn.key);
        try {
          const res = await Promise.resolve(fn.handler(data, dispatch.bind(null, i + 1)));
          logger.timeEnd(fn.key, `[${fn.key}] end`);
          return res;
        } catch (err) {
          console.error(err);
          logger.timeEnd(fn.key, `[${fn.key}] failed`);
          return Promise.reject(err);
        }
      };

      return dispatch(0);
    };
  }

  /**
   * 发布云资源
   * @param data {object} 代码包信息
   * @param data.root {string} 项目根目录
   * @param data.filename {string} 包括完整路径的流程文件名
   * @param data.env {string} 环境
   */
  public deploy (data: DeployData): any {
    this.logger.debug('onDeploy');
    return this.compose('onDeploy')(data);
  }

  /**
   * 启动云实例
   */
  public async mount (data: {
    event: any;
    context: any;
    config?: any;
  }): Promise<any> {
    this.logger.debug('onMount');
    if (this.mounted) {
      this.logger.warn('mount() has been called, skipped.');
      return;
    }

    data.config = this.config;
    try {
      this.logger.time('mount');
      await this.compose('onMount')(data);
      this.mounted = true;
    } finally {
      this.logger.timeEnd('mount', 'mounted');
    }
  }

  /**
   * 执行云函数
   * @param data {object} 执行信息
   */
  public async invoke (data: InvokeData): Promise<any> {
    // 实例未启动时执行启动函数
    if (!this.mounted)
      await this.mount({
        event: data.event,
        context: data.context,
      });

    try {
      await this.compose('onInvoke')(data);
    } catch (error) {
      // 执行异常时回传异常
      this.logger.error(error);
      data.response = error;
    }
  }

  /**
   * 创建触发函数
   */
  public export (): {
    handler: ExportedHandler;
  } {
    return {
      handler: async (event: any, context?: any, callback?: (...args: any) => any): Promise<any> => {
        this.logger.debug('event: %o', event);
        this.logger.debug('context: %o', context);

        if (typeof context === 'undefined') context = {};
        if (!context.request_id) context.request_id = new Date().getTime().toString();
        if (!context.request_at) context.request_at = Math.round(new Date().getTime() / 1000);

        const data: InvokeData = {
          event,
          context,
          callback,
          response: undefined,
          handler: this.handler,
          logger: this.logger,
          config: this.config
        };

        await this.invoke(data);

        if (Object.prototype.toString.call(data.response) === '[object Error]') throw data.response;

        return data.response;
      }
    };
  }
}
