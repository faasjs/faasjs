import Logger from '@faasjs/logger';
import RunHandler from './plugins/run_handler/index';

export type Handler = (data: InvokeData) => any;
export type Next = () => Promise<void>;
export type ExportedHandler = (event: any, context?: any, callback?: (...args: any) => any) => Promise<any>;

export interface Plugin {
  type: string;
  name?: string;
  onDeploy?: (data: DeployData, next: Next) => void;
  onMount?: (data: MountData, next: Next) => void;
  onInvoke?: (data: InvokeData, next: Next) => void;
  [key: string]: any;
}

export interface Config {
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
      provider?: string;
      type: string;
      config?: {
        [key: string]: any;
      };
      [key: string]: any;
    };
  };
  [key: string]: any;
}
export interface DeployData {
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
      name?: string;
      type: string;
      provider?: string;
      config: {
        [key: string]: any;
      };
      plugin: Plugin;
      [key: string]: any;
    };
  };
  logger?: Logger;
  [key: string]: any;
}

export interface MountData {
  config: Config;
  event: any;
  context: any;
  [key: string]: any;
}

export interface InvokeData {
  event: any;
  context: any;
  callback: any;
  response: any;
  logger: Logger;
  handler: Handler;
  config: Config;
  [key: string]: any;
}

export type LifeCycleKey = 'onDeploy' | 'onMount' | 'onInvoke';

export class Func {
  public plugins: Plugin[];
  public handler: Handler;
  public logger: Logger;
  public config: Config;
  private mounted: boolean;
  private cachedFunctions: {
    [key in LifeCycleKey]: ((...args: any) => any)[];
  }
  [key: string]: any;

  /**
   * 新建流程
   * @param config {object} 配置项
   * @param config.plugins {Plugin[]} 插件
   * @param config.handler {Handler} 业务函数
   */
  constructor (config: {
    plugins?: Plugin[];
    handler: Handler;
  }) {
    this.logger = new Logger('Func');

    if (typeof config.handler !== 'function') {
      throw Error('Unknown handler');
    }
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

  public compose (key: LifeCycleKey) {
    let list: ((...args: any) => any)[] = [];

    if (this.cachedFunctions[key as LifeCycleKey]) {
      list = this.cachedFunctions[key as LifeCycleKey];
    } else {
      for (const plugin of this.plugins) {
        if (typeof plugin[key as LifeCycleKey] === 'function') {
          list.push(plugin[key as LifeCycleKey].bind(plugin));
        }
      }
      this.cachedFunctions[key as LifeCycleKey] = list;
    }

    return function (data: any, next?: () => void) {
      let index = -1;

      const dispatch = function (i: number): any {
        if (i <= index) return Promise.reject(Error('next() called multiple times'));
        index = i;
        let fn: any = list[i as number];
        if (i === list.length) fn = next;
        if (!fn) return Promise.resolve();
        try {
          return Promise.resolve(fn(data, dispatch.bind(null, i + 1)));
        } catch (err) {
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
  public deploy (data: DeployData) {
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
  }) {
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
    } catch (error) {
      this.logger.timeEnd('mount', 'mounted');
      throw error;
    }
  }

  /**
   * 执行云函数
   * @param data {object} 执行信息
   */
  public async invoke (data: InvokeData) {
    this.logger.debug('onInvoke');

    // 实例未启动时执行启动函数
    if (!this.mounted) {
      await this.mount({
        event: data.event,
        context: data.context,
      });
    }
    try {
      await this.compose('onInvoke')(data);
    } catch (error) {
      // 执行异常时回传异常
      this.logger.error(error);
      // eslint-disable-next-line require-atomic-updates
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
      handler: async (event: any, context?: any, callback?: (...args: any) => any) => {
        this.logger.debug('event: %o', event);
        this.logger.debug('context: %o', context);

        if (typeof context === 'undefined') {
          context = {};
        }

        if (!context.request_id) {
          context.request_id = new Date().getTime().toString();
        }

        if (!context.request_at) {
          context.request_at = Math.round(new Date().getTime() / 1000);
        }

        const data: InvokeData = {
          event,
          context,
          callback,
          response: null,
          handler: this.handler,
          logger: this.logger,
          config: this.config
        };

        this.logger.time('invoke');
        await this.invoke(data);
        this.logger.timeEnd('invoke', 'invoked');

        if (typeof data.response !== 'undefined' && (data.response instanceof Error || data.response.constructor.name === 'Error')) {
          throw data.response;
        }

        return data.response;
      }
    };
  }
}
