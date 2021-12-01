import { DeployData } from '@faasjs/func'
import { deepMerge } from '@faasjs/deep_merge'
import { Logger, Color } from '@faasjs/logger'
import { execSync } from 'child_process'
import { join } from 'path'
import { CreateFunctionCommand, LambdaClient } from '@aws-sdk/client-lambda'
import { ReadStream } from 'fs'
import { PassThrough } from 'stream'

const defaults = {
  Handler: 'index.handler',
  MemorySize: 128,
  Timeout: 30,
  Runtime: 'nodejs'
}

const INCLUDED_NPM = ['@faasjs/load']

export async function deployLambda (
  data: DeployData,
  origin: { [key: string]: any }
): Promise<void> {
  const logger = new Logger(`${data.env}#${data.name}`)

  const loggerPrefix = `[${data.env}#${data.name}]`
  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[01/12]')} generate configs...`)

  const config = deepMerge(origin)

  if (config.config.name) {
    config.config.FunctionName = config.config.name
    delete config.config.name
  } else config.config.FunctionName = data.name.replace(/[^a-zA-Z0-9-_]/g, '_')

  if (!config.config.Description) config.config.Description = `Source: ${data.name}\nPublished by ${process.env.LOGNAME}\nPublished at ${config.config.version}`

  if (config.config.memorySize) {
    config.config.MemorySize = config.config.memorySize
    delete config.config.memorySize
  }
  if (config.config.timeout) {
    config.config.Timeout = config.config.timeout
    delete config.config.timeout
  }

  config.config = deepMerge(defaults, config.config, {
    // 基本参数
    Region: config.config.region,
    Namespace: data.env,
    Environment: {
      Variables: [
        {
          Key: 'FaasMode',
          Value: 'remote'
        },
        {
          Key: 'FaasEnv',
          Value: data.env
        },
        {
          Key: 'FaasLog',
          Value: 'debug'
        },
        {
          Key: 'NODE_ENV',
          Value: data.env
        }
      ]
    },
    FunctionVersion: '1',

    filename: data.filename,
    name: data.name,
    version: data.version,
    env: data.env,
    dependencies: data.dependencies,
    tmp: data.tmp,

    ZipFilePath: data.env + '/' + config.config.FunctionName + '/' + data.version + '.zip'
  })

  logger.debug('[01/12] 完成配置项 %o', config)

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[02/12]')} 生成代码包...`)

  logger.debug('[2.1/12] 生成 index.js...')
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

  logger.debug('%o', ts.modules)

  logger.debug('[2.2/12] 生成 node_modules...')
  for (const key in ts.modules) {
    const target = join(config.config.tmp, 'node_modules', key)
    execSync(`mkdir -p ${target}`)
    execSync(`rsync -avhpr --exclude '*.cache' --exclude '*.bin' --exclude 'LICENSE' --exclude 'license' --exclude 'ChangeLog' --exclude 'CHANGELOG' --exclude '*.ts' --exclude '*.flow' --exclude '*.map' --exclude '*.md' --exclude 'node_modules/*/node_modules' --exclude '__tests__' ${join(ts.modules[key], '*')} ${target}`)
  }

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[03/12]')} 打包代码包...`)
  execSync(`cd ${config.config.tmp} && zip -r deploy.zip *`)

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[04/12]')} 检查 COS...`)

  const client = new LambdaClient({
    region: config.config.Region,
    credentials: config.config.credentials
  })

  const command = new CreateFunctionCommand({
    FunctionName: config.config.FunctionName,
    Role: config.config.Role,
    Code: {
      ZipFile: await new Promise((resolve, reject) => {
        const rs = new ReadStream(config.config.ZipFilePath)
        rs.on('error', reject)
        rs.on('end', resolve)
        rs.pipe(new PassThrough())
      })
    },
    Description: config.config.Description,
    Handler: config.config.Handler,
    MemorySize: config.config.MemorySize,
    Publish: true,
    Runtime: config.config.Runtime,
    Timeout: config.config.Timeout
  })

  await client.send(command)
}
