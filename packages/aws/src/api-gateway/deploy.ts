import { DeployData } from '@faasjs/func'
import { deepMerge } from '@faasjs/deep_merge'
import { Logger, Color } from '@faasjs/logger'
import { AWSConfig } from '..'
import {
  ApiGatewayV2Client,
  GetApisCommand,
  CreateApiCommand,
  CreateRouteCommand,
} from '@aws-sdk/client-apigatewayv2'

const defaults = {
  EnableCORS: true,
  RequestConfig: { Method: 'POST' },
  ServiceType: 'SCF',
  ServiceScfIsIntegratedResponse: true,
  ServiceTimeout: 1800
}

async function runCommand (client: ApiGatewayV2Client, command: any): Promise<any> {
  try {
    return await client.send(command)
  } catch (error: any) {
    if (error.name === 'ResourceConflictException') {
      return runCommand(client, command)
    }
    throw error
  }
}

export async function deployApiGateway (
  aws: AWSConfig,
  data: DeployData,
  origin: { [key: string]: any }
): Promise<void> {
  const logger = new Logger(`${data.env}#${data.name}`)

  const config = deepMerge(origin)

  if (!config.config.RequestConfig) config.config.RequestConfig = {}

  config.config.RequestConfig.Path = config.config.path
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
  } else config.config.ServiceScfFunctionName = data.name.replace(/[^a-zA-Z0-9-_]/g, '_')

  config.config = deepMerge(defaults, config.config, {
    ApiName: data.name,
    ServiceScfFunctionNamespace: data.env,
    ServiceScfFunctionQualifier: data.env
  })

  const loggerPrefix = `[${data.env}#${data.name}]`

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[1/3]')} Update api...`)

  const client = new ApiGatewayV2Client({
    region: aws.region,
    credentials: {
      accessKeyId: aws.accessKeyId,
      secretAccessKey: aws.secretKey
    }
  })

  if (!config.config.apiId) {
    logger.debug('Get api info...')
    const list = await runCommand(client, new GetApisCommand({}))
    let apiInfo = list.Items.find((item: any) => item.Name === data.env)

    if (!apiInfo) {
      logger.debug('Creating api %s...', data.env)
      apiInfo = await runCommand(client, new CreateApiCommand({
        Name: data.env,
        ProtocolType: 'HTTP',
        RouteSelectionExpression: '${request.method} ${request.path}',
        CorsConfiguration: {
          AllowHeaders: ['*'],
          AllowMethods: ['*'],
          AllowOrigins: ['*'],
          ExposeHeaders: ['*']
        }
      })) as any
    }

    config.config.apiId = apiInfo.ApiId
  }

  try {
    logger.debug('Creating route %s...', config.config.RequestConfig.Path)
    await runCommand(client, new CreateRouteCommand({
      ApiId: config.config.apiId,
      RouteKey: config.config.RequestConfig.Method + ' ' + config.config.RequestConfig.Path,
    }))
  } catch (error: any) {
    if (!error.message.includes('already exists for this API'))
      throw error
  }

  // logger.debug('Creating ')
}
