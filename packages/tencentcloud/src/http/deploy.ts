import { DeployData } from '@faasjs/func'
import { api } from './api'
import { deepMerge } from '@faasjs/deep_merge'
import { Provider } from '..'
import { Color } from '@faasjs/logger'

const defaults = {
  EnableCORS: true,
  RequestConfig: { Method: 'POST' },
  ServiceType: 'SCF',
  ServiceScfIsIntegratedResponse: true,
  ServiceTimeout: 1800,
}

export async function deployHttp(
  tc: Provider,
  data: DeployData,
  origin: { [key: string]: any }
): Promise<void> {
  tc.logger.label = `${data.env}#${data.name}`

  const config = deepMerge(origin)

  if (!config.config.RequestConfig) config.config.RequestConfig = {}

  // 参数名适配
  config.config.RequestConfig.Path = `=${config.config.path}`
  delete config.config.path

  if (config.config.method) {
    config.config.RequestConfig.Method = config.config.method
    delete config.config.method
  }
  if (config.config.timeout) {
    config.config.ServiceTimeout = config.config.timeout
    delete config.config.timeout
  }
  if (config.config.functionName) {
    config.config.ServiceScfFunctionName = config.config.functionName
    delete config.config.functionName
  } else
    config.config.ServiceScfFunctionName = data.name.replace(
      /[^a-zA-Z0-9-_]/g,
      '_'
    )

  // 合并配置项
  config.config = deepMerge(defaults, config.config, {
    ApiName: data.name,
    ServiceScfFunctionNamespace: data.env,
    ServiceScfFunctionQualifier: data.env,
  })

  // 参数白名单检查
  const ALLOWS = [
    'ServiceId',
    'ServiceType',
    'ServiceTimeout',
    'Protocol',
    'RequestConfig',
    'ApiName',
    'ApiDesc',
    'EnableCORS',
    'ConstantParameters',
    'RequestParameters',
    'ServiceScfFunctionName',
    'ServiceWebsocketRegisterFunctionName',
    'ServiceWebsocketCleanupFunctionName',
    'ServiceWebsocketTransportFunctionName',
    'ServiceScfFunctionNamespace',
    'ServiceScfFunctionQualifier',
    'ServiceWebsocketRegisterFunctionNamespace',
    'ServiceWebsocketRegisterFunctionQualifier',
    'ServiceWebsocketTransportFunctionNamespace',
    'ServiceWebsocketTransportFunctionQualifier',
    'ServiceWebsocketCleanupFunctionNamespace',
    'ServiceWebsocketCleanupFunctionQualifier',
    'ServiceScfIsIntegratedResponse',
  ]
  for (const key in config.config)
    if (!ALLOWS.includes(key)) delete config.config[key]

  const provider = tc.config
  const loggerPrefix = `[${data.env}#${data.name}]`
  let OuterSubDomain: string

  tc.logger.raw(
    `${tc.logger.colorfy(Color.GRAY, `${loggerPrefix}[1/3]`)} 更新服务信息...`
  )
  if (!config.config.ServiceId) {
    let serviceInfo = await api('DescribeServicesStatus', provider, {
      Filters: [
        {
          Name: 'ServiceName',
          Values: [data.env],
        },
      ],
    }).then(body =>
      body.Result.ServiceSet.find((item: any) => item.ServiceName === data.env)
    )

    if (!serviceInfo)
      serviceInfo = await api('CreateService', provider, {
        ServiceName: data.env,
        Protocol: 'http&https',
      })

    config.config.ServiceId = serviceInfo.ServiceId
    OuterSubDomain = serviceInfo.OuterSubDomain
  }

  tc.logger.raw(
    `${tc.logger.colorfy(Color.GRAY, `${loggerPrefix}[2/3]`)} 更新接口信息...`
  )

  let apiInfo = await api('DescribeApisStatus', provider, {
    Filters: [
      {
        Name: 'ApiName',
        Values: [config.config.ApiName],
      },
    ],
    ServiceId: config.config.ServiceId,
  }).then(body =>
    body.Result.ApiIdStatusSet.find(
      (item: any) => item.Path === config.config.RequestConfig.Path
    )
  )

  if (apiInfo) {
    apiInfo = await api('DescribeApi', provider, {
      ServiceId: config.config.ServiceId,
      ApiId: apiInfo.ApiId,
    }).then(body => body.Result)
    if (
      apiInfo.ServiceType !== 'SCF' ||
      apiInfo.ServiceTimeout !== config.config.ServiceTimeout ||
      apiInfo.ServiceScfFunctionName !== config.config.ServiceScfFunctionName ||
      apiInfo.ServiceScfFunctionNamespace !==
        config.config.ServiceScfFunctionNamespace ||
      apiInfo.ServiceScfFunctionQualifier !==
        config.config.ServiceScfFunctionQualifier ||
      apiInfo.RequestConfig.Method !== config.config.RequestConfig.Method
    )
      await api(
        'ModifyApi',
        provider,
        Object.assign(config.config, {
          ApiId: apiInfo.ApiId,
          ServiceId: config.config.ServiceId,
        })
      )
    else {
      tc.logger.raw(
        `${tc.logger.colorfy(
          Color.GRAY,
          `${loggerPrefix}[3/3]`
        )} 接口无变动，无需更新`
      )
      return
    }
  } else
    await api(
      'CreateApi',
      provider,
      Object.assign(config.config, {
        ServiceId: config.config.ServiceId,
        Protocol: 'HTTP',
      })
    )

  tc.logger.raw(
    `${tc.logger.colorfy(Color.GRAY, `${loggerPrefix}[3/3]`)} 发布网关...`
  )

  await api('ReleaseService', provider, {
    EnvironmentName: 'release',
    ReleaseDesc: `Published ${config.config.ServiceScfFunctionName} by ${process.env.LOGNAME}`,
    ServiceId: config.config.ServiceId,
  })

  tc.logger.info(
    `接口发布完成 ${config.config.RequestConfig.Method} ${
      OuterSubDomain ? `https://${OuterSubDomain}` : ''
    }${config.config.RequestConfig.Path.replace(/^=/, '')}`
  )
}
