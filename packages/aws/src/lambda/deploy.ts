import { DeployData } from '@faasjs/func'
import { deepMerge } from '@faasjs/deep_merge'
import { Logger, Color } from '@faasjs/logger'
import { execSync } from 'child_process'
import { join } from 'path'
import {
  CreateFunctionCommand,
  GetFunctionCommand,
  LambdaClient,
  UpdateFunctionCodeCommand,
  UpdateFunctionConfigurationCommand
} from '@aws-sdk/client-lambda'
import { readFileSync } from 'fs'
import { AWSConfig } from '..'

const defaults = {
  Handler: 'index.handler',
  MemorySize: 128,
  Timeout: 30,
  Runtime: 'nodejs14.x'
}

const INCLUDED_NPM = ['@faasjs/load']

async function runCommand (client: LambdaClient, command: any): Promise<any> {
  try {
    return await client.send(command)
  } catch (error: any) {
    if (error.name === 'ResourceConflictException') {
      return runCommand(client, command)
    }
    throw error
  }
}

export async function deployLambda (
  aws: AWSConfig,
  data: DeployData,
  origin: { [key: string]: any }
): Promise<void> {
  const logger = new Logger(`${data.env}#${data.name}`)

  const loggerPrefix = `[${data.env}#${data.name}]`
  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[01/4]')} Generate configuration...`)

  const config = deepMerge(origin)

  if (config.config.name) {
    config.config.FunctionName = config.config.name
    delete config.config.name
  } else
    config.config.FunctionName = data.name.replace(/[^a-zA-Z0-9-_]/g, '_')

  if (!config.config.Description)
    config.config.Description = `${data.env}\nSource: ${data.name}\nPublished by ${process.env.LOGNAME}\nPublished at ${config.config.version}`

  if (config.config.memorySize) {
    config.config.MemorySize = config.config.memorySize
    delete config.config.memorySize
  }

  if (config.config.timeout) {
    config.config.Timeout = config.config.timeout
    delete config.config.timeout
  }

  config.config = deepMerge(defaults, config.config, {
    Namespace: data.env,
    Environment: {
      Variables: {
        FaasMode: 'remote',
        FaasEnv: data.env,
        FaasLog: 'debug',
        NODE_ENV: data.env
      }
    },
    FunctionVersion: '1',

    filename: data.filename,
    name: data.name,
    version: data.version,
    env: data.env,
    dependencies: data.dependencies,
    tmp: data.tmp,
  })

  logger.debug('[01/4] Generated: %j', config)

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[02/4]')} Generate function files...`)

  logger.debug('[2.1/4] Generate index.js...')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ts = await require('@faasjs/load').loadTs(config.config.filename, {
    output: {
      file: config.config.tmp + '/index.js',
      format: 'cjs',
      name: 'index',
      banner: `/**
 * @name ${config.config.name}
 * @author ${config.config.author}
 * @build ${config.config.version}
 * @staging ${config.config.env}
 * @dependencies ${Object.keys(config.config.dependencies).join(',')}
 */`,
      footer: `
const main = module.exports;
main.config = ${JSON.stringify(data.config)};
if(typeof cloud_function !== 'undefined' && !main.plugins.find(p => p.type === 'cloud_function'))
  main.plugins.unshift(new cloud_function.CloudFunction(main.config.plugins['cloud_function'] || {}))
module.exports = main.export();`
    },
    modules: {
      excludes: INCLUDED_NPM,
      additions: Object.keys(config.config.dependencies).concat(['@faasjs/tencentcloud'])
    }
  })

  logger.debug('%j', ts.modules)

  logger.debug('[2.2/4] Generate node_modules...')
  for (const key in ts.modules) {
    const target = join(config.config.tmp, 'node_modules', key)
    execSync(`mkdir -p ${target}`)
    execSync(`rsync -avhpr --exclude '*.cache' --exclude '*.bin' --exclude 'LICENSE' --exclude 'license' --exclude 'ChangeLog' --exclude 'CHANGELOG' --exclude '*.ts' --exclude '*.flow' --exclude '*.map' --exclude '*.md' --exclude 'node_modules/*/node_modules' --exclude '__tests__' ${join(ts.modules[key], '*')} ${target}`)
  }

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[03/4]')} Generate zip file...`)
  execSync(`cd ${config.config.tmp} && zip -r deploy.zip *`)

  const client = new LambdaClient({
    region: aws.region,
    credentials: {
      accessKeyId: aws.accessKeyId,
      secretAccessKey: aws.secretKey
    }
  })

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[04/4]')} Deploying...`)

  try {
    logger.debug('[4.1/4] Get function...')
    await runCommand(client, new GetFunctionCommand({ FunctionName: config.config.FunctionName }))

    logger.debug('[4.2/4] Update function configuration...')
    await runCommand(client, new UpdateFunctionConfigurationCommand({
      FunctionName: config.config.FunctionName,
      Role: config.config.role,
      Description: config.config.Description,
      Handler: config.config.Handler,
      MemorySize: config.config.MemorySize,
      Runtime: config.config.Runtime,
      Timeout: config.config.Timeout,
      Environment: config.config.Environment,
    }))

    logger.debug('[4.3/4] Update function code...')
    await runCommand(client, new UpdateFunctionCodeCommand({
      FunctionName: config.config.FunctionName,
      ZipFile: readFileSync(join(config.config.tmp, 'deploy.zip')),
      Publish: true,
    }))
  } catch (error: any) {
    if (error.name !== 'ResourceNotFoundException')
      throw error

    logger.debug('[4.2/4] Create function...')
    await runCommand(client, new CreateFunctionCommand({
      FunctionName: config.config.FunctionName,
      Role: config.config.role,
      Code: { ZipFile: readFileSync(join(config.config.tmp, 'deploy.zip')) },
      Description: config.config.Description,
      Handler: config.config.Handler,
      MemorySize: config.config.MemorySize,
      Publish: true,
      Runtime: config.config.Runtime,
      Timeout: config.config.Timeout,
      Environment: config.config.Environment,
      Tags: {
        Env: data.env,
        Source: 'FaasJS'
      }
    }))
  }

  logger.info(`Lambda deployed ${data.name}#${config.config.FunctionVersion}`)
}
