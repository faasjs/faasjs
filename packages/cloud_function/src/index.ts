import { deepMerge } from '@faasjs/deep_merge'
import {
  Plugin,
  DeployData,
  Next,
  MountData,
  InvokeData,
  usePlugin,
  UseifyPlugin,
} from '@faasjs/func'
import { Logger } from '@faasjs/logger'
import { Validator, ValidatorConfig } from './validator'

/** 云函数配置项 */
export type CloudFunctionConfig = {
  /** 插件名称 */
  name?: string
  /** 配置项 */
  config?: {
    /** 配置名称 */
    name?: string
    /** 内存大小，单位为MB，默认 64 */
    memorySize?: 64 | 128 | 256 | 384 | 512 | 640 | 768 | 896 | 1024 | number
    /** 执行超时时间，单位为秒，默认 30 */
    timeout?: number
    /** 触发器配置 */
    triggers?: {
      type: 'timer' | string
      name?: string
      value: string
    }[]
    /** 预制并发配置 */
    provisionedConcurrent?: {
      /** 预制并发数量 */
      executions: number
    }
    [key: string]: any
  }
  validator?: {
    event?: ValidatorConfig
  }
  [key: string]: any
}

export type CloudFunctionAdapter = {
  invokeCloudFunction: (name: string, data: any, options?: any) => Promise<void>
  invokeSyncCloudFunction: <TResult>(
    name: string,
    data: any,
    options?: any
  ) => Promise<TResult>
}

const Name = 'cloud_function'

const globals: {
  [name: string]: CloudFunction
} = {}

export class CloudFunction implements Plugin {
  public readonly type: string = Name
  public readonly name: string = Name
  public event: any
  public context: any
  public config: {
    name?: string
    memorySize?: number
    timeout?: number
    triggers?: {
      type: string
      name: string
      value: string
    }[]
    [key: string]: any
  }

  private adapter: CloudFunctionAdapter
  private readonly validatorConfig?: {
    event?: ValidatorConfig
  }

  private validator?: Validator
  private readonly logger: Logger

  /**
   * 创建云函数配置
   * @param config {object} 配置项，这些配置将强制覆盖默认配置
   * @param config.name {string} 云资源名
   * @param config.config {object} 云资源配置
   * @param config.config.name {string} 云函数名
   * @param config.config.memorySize {number} 内存大小，单位为 MB
   * @param config.config.timeout {number} 最长执行时间，单位为 秒
   * @param config.config.triggers {object[]} 触发器配置
   * @param config.config.provisionedConcurrent {object} 预制并发配置
   * @param config.config.provisionedConcurrent.executions {number} 并发数
   * @param config.validator {object} 事件校验配置
   * @param config.validator.event {object} event 校验配置
   * @param config.validator.event.whitelist {string} 白名单配置
   * @param config.validator.event.onError {function} 自定义报错
   * @param config.validator.event.rules {object} 参数校验规则
   */
  constructor(config?: CloudFunctionConfig) {
    if (config) {
      this.name = config.name || Name
      this.config = config.config || Object.create(null)
      if (config.validator) this.validatorConfig = config.validator
    } else {
      this.name = this.type
      this.config = Object.create(null)
    }
    this.logger = new Logger(this.name)
  }

  public async onDeploy(data: DeployData, next: Next): Promise<void> {
    this.logger.debug('[CloudFunction] Merge configuration...')
    this.logger.debug('%j', data)

    const config = data.config.plugins
      ? deepMerge(data.config.plugins[this.name], { config: this.config })
      : { config: this.config }

    this.logger.debug('[CloudFunction] Merged configuration: %j', config)

    // 引用服务商部署插件
    const Provider = require(config.provider.type).Provider
    const provider = new Provider(config.provider.config)

    data.dependencies['@faasjs/cloud_function'] = '*'
    data.dependencies[config.provider.type as string] = '*'

    // 部署云函数
    await provider.deploy(this.type, data, config)

    await next()
  }

  public async onMount(data: MountData, next: Next): Promise<void> {
    if (data.config.plugins?.[this.name || this.type])
      this.config = deepMerge(
        { config: this.config },
        data.config.plugins[this.name || this.type],
        {}
      )

    if (this.config.provider) {
      const Provider = require(this.config.provider.type).Provider
      this.adapter = new Provider(this.config.provider.config)
    } else
      this.logger.warn(
        '[onMount] Unknown provider, will use invoke and invokeSync with local mode.'
      )

    if (this.validatorConfig) {
      this.logger.debug('[onMount] prepare validator')
      this.validator = new Validator(this.validatorConfig)
    }

    globals[this.name] = this

    await next()
  }

  public async onInvoke(data: InvokeData, next: Next): Promise<void> {
    this.event = data.event
    this.context = data.context
    if (this.validator) {
      this.logger.debug('[onInvoke] Valid')
      this.validator.valid({ event: this.event })
    }
    await next()
  }

  /**
   * 异步触发云函数
   * @param name {string} 云函数文件名或云函数名
   * @param data {any} 参数
   * @param options {object} 额外配置项
   */
  public async invoke<TData = any>(
    name: string,
    data?: TData,
    options?: Record<string, any>
  ): Promise<void> {
    if (data == null) data = Object.create(null)

    if (process.env.FaasMode !== 'remote') {
      const test = require('@faasjs/test')
      const func = new test.FuncWarper(
        `${process.env.FaasRoot || ''}${name.toLowerCase()}.func`
      )
      return func.handler(data, { request_id: this.logger.label })
    }
    return this.adapter.invokeCloudFunction(name.toLowerCase(), data, options)
  }

  /**
   * 同步调用云函数
   * @param name {string} 云函数文件名或云函数名
   * @param data {any} 参数
   * @param options {object} 额外配置项
   */
  public async invokeSync<TResult = any, TData = any>(
    name: string,
    data?: TData,
    options?: Record<string, any>
  ): Promise<TResult> {
    if (data == null) data = Object.create(null)

    if (process.env.FaasMode !== 'remote') {
      const test = require('@faasjs/test')
      const func = new test.FuncWarper(
        `${process.env.FaasRoot || ''}${name.toLowerCase()}.func`
      )
      return func.handler(data, { request_id: this.logger.label })
    }
    return this.adapter.invokeSyncCloudFunction<TResult>(
      name.toLowerCase(),
      data,
      options
    )
  }
}

export function useCloudFunction(
  config?: CloudFunctionConfig | (() => CloudFunctionConfig)
): UseifyPlugin<CloudFunction> {
  let configs
  if (config)
    if (typeof config === 'function') configs = config()
    else configs = config

  const name = configs?.name || Name

  if (globals[name]) return usePlugin<CloudFunction>(globals[name])

  return usePlugin<CloudFunction>(new CloudFunction(configs))
}

/**
 * 异步触发云函数
 * @param name {string} 云函数文件名或云函数名
 * @param data {any} 参数
 * @param options {object} 额外配置项
 */
export async function invoke<TData = any>(
  name: string,
  data?: TData,
  options?: {
    [key: string]: any
  }
): Promise<void> {
  return await useCloudFunction().invoke<TData>(name, data, options)
}

/**
 * 同步触发云函数
 * @param name {string} 云函数文件名或云函数名
 * @param data {any} 参数
 * @param options {object} 额外配置项
 */
export async function invokeSync<TResult = any, TData = any>(
  name: string,
  data?: TData,
  options?: {
    [key: string]: any
  }
): Promise<TResult> {
  return await useCloudFunction().invokeSync<TResult, TData>(
    name,
    data,
    options
  )
}
