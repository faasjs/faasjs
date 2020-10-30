import deepMerge from '@faasjs/deep_merge';
import { Plugin, DeployData, Next, MountData, InvokeData, usePlugin, UseifyPlugin } from '@faasjs/func';
import Logger from '@faasjs/logger';
import { Validator, ValidatorConfig } from './validator';

export interface CloudFunctionConfig {
  name?: string;
  config?: {
    name?: string;
    memorySize?: number;
    timeout?: number;
    triggers?: {
      type: string;
      name: string;
      value: string;
    }[];
    [key: string]: any;
  };
  validator?: {
    event?: ValidatorConfig;
  };
  [key: string]: any;
}

export interface CloudFunctionAdapter {
  invokeCloudFunction(name: string, data: any, options?: any): Promise<void>;
  invokeSyncCloudFunction<TResult>(name: string, data: any, options?: any): Promise<TResult>;
}

const Name = 'cloud_function';

const globals: {
  [name: string]: CloudFunction;
} = {};

export class CloudFunction implements Plugin {
  public readonly type: string = Name;
  public readonly name: string = Name;
  public event: any;
  public context: any;
  private config: {
    name?: string;
    memorySize?: number;
    timeout?: number;
    triggers?: {
      type: string;
      name: string;
      value: string;
    }[];
    [key: string]: any;
  };
  private adapter?: CloudFunctionAdapter;
  private validatorConfig?: {
    event?: ValidatorConfig;
  };
  private validator?: Validator;
  private logger: Logger;

  /**
   * 创建云函数配置
   * @param config {object} 配置项，这些配置将强制覆盖默认配置
   * @param config.name {string} 云资源名
   * @param config.config {object} 云资源配置
   * @param config.config.name {string} 云函数名
   * @param config.config.memorySize {number} 内存大小，单位为 MB
   * @param config.config.timeout {number} 最长执行时间，单位为 秒
   * @param config.validator {object} 事件校验配置
   * @param config.validator.event {object} event 校验配置
   * @param config.validator.event.whitelist {string} 白名单配置
   * @param config.validator.event.onError {function} 自定义报错
   * @param config.validator.event.rules {object} 参数校验规则
   */
  constructor (config?: CloudFunctionConfig) {
    if (config) {
      this.name = config.name;
      this.config = config.config || Object.create(null);
      if (config.validator)
        this.validatorConfig = config.validator;
    } else {
      this.name = this.type;
      this.config = Object.create(null);
    }
    this.logger = new Logger(this.name);
  }

  public async onDeploy (data: DeployData, next: Next): Promise<void> {
    data.logger.debug('[CloudFunction] 组装云函数配置');
    data.logger.debug('%o', data);

    const config = deepMerge(data.config.plugins[this.name || this.type], { config: this.config });

    data.logger.debug('[CloudFunction] 组装完成 %o', config);

    // 引用服务商部署插件
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const Provider = require(config.provider.type);
    const provider = new (typeof Provider === 'function' ? Provider : Provider.default)(config.provider.config);

    data.dependencies[config.provider.type as string] = '*';

    // 部署云函数
    await provider.deploy(this.type, data, config);

    await next();
  }

  public async onMount (data: MountData, next: Next): Promise<void> {
    if (data.config['plugins'] && data.config.plugins[this.name || this.type])
      this.config = deepMerge({ config: this.config }, data.config.plugins[this.name || this.type], {});

    if (this.config.provider) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const Provider = require(this.config.provider.type);
      this.adapter = new Provider(this.config.provider.config);
    } else
      this.logger.warn('[onMount] Unknow provider, can\'t use invoke and invokeSync.');

    if (this.validatorConfig) {
      this.logger.debug('[onMount] prepare validator');
      this.validator = new Validator(this.validatorConfig);
    }

    globals[this.name] = this;

    await next();
  }

  public async onInvoke (data: InvokeData, next: Next): Promise<void> {
    this.event = data.event;
    this.context = data.context;
    if (this.validator) {
      this.logger.debug('[onInvoke] Valid');
      this.validator.valid({ event: this.event });
    }
    await next();
  }

  /**
   * 异步触发云函数
   * @param name {string} 云函数文件名或云函数名
   * @param data {any} 参数
   * @param options {object} 额外配置项
   */
  public async invoke<TData = any> (name: string, data?: TData, options?: {
    [key: string]: any;
  }): Promise<void> {
    if (!data) data = Object.create(null);

    await this.adapter.invokeCloudFunction(name, Object.assign(data, { context: this.context ? JSON.parse(JSON.stringify(this.context)) : {} }), options);
  }

  /**
   * 同步调用云函数
   * @param name {string} 云函数文件名或云函数名
   * @param data {any} 参数
   * @param options {object} 额外配置项
   */
  public async invokeSync<TResult = any, TData = any> (name: string, data?: TData, options?: {
    [key: string]: any;
  }): Promise<TResult> {
    if (!data) data = Object.create(null);

    return this.adapter.invokeSyncCloudFunction<TResult>(name, Object.assign(data, { context: this.context ? JSON.parse(JSON.stringify(this.context)) : {} }), options);
  }
}

export function useCloudFunction (config?: CloudFunctionConfig): CloudFunction & UseifyPlugin {
  const name = config?.name || Name;

  if (globals[name]) return usePlugin<CloudFunction>(globals[name]);

  return usePlugin<CloudFunction>(new CloudFunction(config));
}
