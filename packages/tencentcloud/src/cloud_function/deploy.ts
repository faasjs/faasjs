import { DeployData } from '@faasjs/func'
import { deepMerge } from '@faasjs/deep_merge'
import { Logger, Color } from '@faasjs/logger'
import { execSync } from 'child_process'
import { checkBucket, createBucket, upload, remove } from './cos'
import { scf } from './scf'
import { Provider } from '..'
import { join } from 'path'

const defaults = {
  Handler: 'index.handler',
  MemorySize: 64,
  Timeout: 30,
  Runtime: 'Nodejs12.16',
}

// 腾讯云内置插件 https://cloud.tencent.com/document/product/583/12060
const INCLUDED_NPM = [
  'cos-nodejs-sdk-v5',
  'base64-js',
  'buffer',
  'crypto-browserify',
  'ieee754',
  'imagemagick',
  'isarray',
  'jmespath',
  'lodash',
  'microtime',
  'npm',
  'punycode',
  'puppeteer',
  'qcloudapi-sdk',
  'request',
  'sax',
  'scf-nodejs-serverlessdb-sdk',
  'tencentcloud-sdk-nodejs',
  'url',
  'uuid',
  'xml2js',
  'xmlbuilder',

  // 移除构建所需的依赖项
  '@faasjs/load',
]

export async function deployCloudFunction(
  tc: Provider,
  data: DeployData,
  origin: { [key: string]: any }
): Promise<void> {
  const logger = new Logger(`${data.env}#${data.name}`)

  const loggerPrefix = `[${data.env}#${data.name}]`
  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[01/12]`)} 生成配置项...`
  )

  const config = deepMerge(origin)

  // 补全默认参数
  if (config.config.name) {
    config.config.FunctionName = config.config.name
    delete config.config.name
  } else config.config.FunctionName = data.name.replace(/[^a-zA-Z0-9-_]/g, '_')

  if (!config.config.Description)
    config.config.Description = `Source: ${data.name}\nPublished by ${process.env.LOGNAME}\nPublished at ${config.config.version}`

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
    Region: tc.config.region,
    Namespace: data.env,
    Environment: {
      Variables: [
        {
          Key: 'FaasMode',
          Value: 'remote',
        },
        {
          Key: 'FaasEnv',
          Value: data.env,
        },
        {
          Key: 'FaasLog',
          Value: 'debug',
        },
        {
          Key: 'NODE_ENV',
          Value: data.env,
        },
      ],
    },
    FunctionVersion: '1',

    // 构建参数
    filename: data.filename,
    name: data.name,
    version: data.version,
    env: data.env,
    dependencies: data.dependencies,
    tmp: data.tmp,

    // cos 参数
    Bucket: `scf-${tc.config.appId}`,
    FilePath: `${data.tmp}deploy.zip`,
    CosObjectName: `${data.env}/${config.config.FunctionName}/${data.version}.zip`,
  })

  logger.debug('[01/12] 完成配置项 %j', config)

  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[02/12]`)} 生成代码包...`
  )

  logger.debug('[2.1/12] 生成 index.js...')

  const ts = await require('@faasjs/load').loadTs(config.config.filename, {
    output: {
      file: `${config.config.tmp}/index.js`,
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
module.exports = main.export();`,
    },
    modules: {
      excludes: INCLUDED_NPM,
      additions: Object.keys(config.config.dependencies).concat([
        '@faasjs/tencentcloud',
      ]),
    },
  })

  logger.debug('%j', ts.modules)

  logger.debug('[2.2/12] 生成 node_modules...')
  for (const key in ts.modules) {
    const target = join(config.config.tmp, 'node_modules', key)
    execSync(`mkdir -p ${target}`)
    execSync(
      `rsync -avhpr --exclude '*.cache' --exclude '*.bin' --exclude 'LICENSE' --exclude 'license' --exclude 'ChangeLog' --exclude 'CHANGELOG' --exclude '*.ts' --exclude '*.flow' --exclude '*.map' --exclude '*.md' --exclude 'node_modules/*/node_modules' --exclude '__tests__' ${join(
        ts.modules[key],
        '*'
      )} ${target}`
    )
  }

  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[03/12]`)} 打包代码包...`
  )
  execSync(`cd ${config.config.tmp} && zip -r deploy.zip *`)

  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[04/12]`)} 检查 COS...`
  )

  try {
    logger.debug('[4.1/12] 检查 Cos Bucket 状态')
    await checkBucket(tc, {
      Bucket: config.config.Bucket,
      Region: tc.config.region,
    })
    logger.debug('[4.2/12] Cos Bucket 已存在，跳过')
  } catch (error) {
    logger.debug('[4.2/12] 创建 Cos Bucket...')
    await createBucket(tc, {
      Bucket: config.config.Bucket,
      Region: tc.config.region,
    })
  }

  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[05/12]`)} 上传代码包...`
  )
  await upload(tc, {
    Bucket: config.config.Bucket,
    FilePath: config.config.FilePath,
    Key: config.config.CosObjectName,
    Region: tc.config.region,
  })

  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[06/12]`)} 检查命名空间...`
  )
  logger.debug('[6.1/12] 检查命名空间状态')
  const namespaceList = await scf('ListNamespaces', tc.config, {})
  if (
    !namespaceList.Namespaces.find(
      (n: any) => n.Name === config.config.Namespace
    )
  ) {
    logger.debug('[6.2/12] 创建命名空间...')
    await scf('CreateNamespace', tc.config, {
      Namespace: config.config.Namespace,
    })
  } else logger.debug('[6.2/12] 命名空间已存在，跳过')

  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[07/12]`)} 上传云函数...`
  )

  try {
    logger.debug('[7.1/12] 检查云函数是否已存在...')
    await scf('GetFunction', tc.config, {
      FunctionName: config.config.FunctionName,
      Namespace: config.config.Namespace,
    })

    logger.debug('[7.2/12] 更新云函数代码...')
    await scf('UpdateFunctionCode', tc.config, {
      CosBucketName: 'scf',
      CosBucketRegion: config.config.Region,
      CosObjectName: config.config.CosObjectName,
      FunctionName: config.config.FunctionName,
      Handler: config.config.Handler,
      Namespace: config.config.Namespace,
    })

    let status = null
    while (status !== 'Active') {
      logger.debug('[7.3/12] 等待云函数代码更新完成...')

      status = await scf('GetFunction', tc.config, {
        FunctionName: config.config.FunctionName,
        Namespace: config.config.Namespace,
      }).then(res => res.Status)
    }

    logger.debug('[7.2/12] 更新云函数配置...')
    await scf('UpdateFunctionConfiguration', tc.config, {
      Environment: config.config.Environment,
      FunctionName: config.config.FunctionName,
      MemorySize: config.config.MemorySize,
      Timeout: config.config.Timeout,
      VpcConfig: config.config.VpcConfig,
      Namespace: config.config.Namespace,
      Role: config.config.Role,
      ClsLogsetId: config.config.ClsLogsetId,
      ClsTopicId: config.config.ClsTopicId,
      Layers: config.config.Layers,
      DeadLetterConfig: config.config.DeadLetterConfig,
      PublicNetConfig: config.config.PublicNetConfig,
      CfsConfig: config.config.CfsConfig,
      InitTimeout: config.config.InitTimeout,
    })

    status = null
    while (status !== 'Active') {
      logger.debug('[7.3/12] 等待云函数配置更新完成...')

      status = await scf('GetFunction', tc.config, {
        FunctionName: config.config.FunctionName,
        Namespace: config.config.Namespace,
      }).then(res => res.Status)
    }
  } catch (error: any) {
    if (error.message.startsWith('ResourceNotFound')) {
      logger.debug('[7.2/12] 创建云函数...')
      await scf('CreateFunction', tc.config, {
        ClsLogsetId: config.config.ClsLogsetId,
        ClsTopicId: config.config.ClsTopicId,
        Code: {
          CosBucketName: 'scf',
          CosBucketRegion: config.config.Region,
          CosObjectName: config.config.CosObjectName,
        },
        CodeSource: config.config.CodeSource,
        Environment: config.config.Environment,
        FunctionName: config.config.FunctionName,
        Handler: config.config.Handler,
        Description: config.config.Description,
        Namespace: config.config.Namespace,
        MemorySize: config.config.MemorySize,
        Runtime: config.config.Runtime,
        Role: config.config.Role,
        Timeout: config.config.Timeout,
        VpcConfig: config.config.VpcConfig,
        Layers: config.config.Layers,
        DeadLetterConfig: config.config.DeadLetterConfig,
        PublicNetConfig: config.config.PublicNetConfig,
        CfsConfig: config.config.CfsConfig,
        InitTimeout: config.config.InitTimeout,
      })

      while (true) {
        logger.debug('[7.3/12] 等待云函数代码更新完成...')
        if (
          (
            await scf('GetFunction', tc.config, {
              FunctionName: config.config.FunctionName,
              Namespace: config.config.Namespace,
            })
          ).Status === 'Active'
        )
          break
      }
    } else throw error
  }

  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[08/12]`)} 发布版本...`
  )

  const version = await scf('PublishVersion', tc.config, {
    Description: `Published by ${process.env.LOGNAME}`,
    FunctionName: config.config.FunctionName,
    Namespace: config.config.Namespace,
  })
  config.config.FunctionVersion = version.FunctionVersion

  while (true) {
    logger.debug('[8.1/12] 等待版本发布完成...')
    if (
      (
        await scf('GetFunction', tc.config, {
          FunctionName: config.config.FunctionName,
          Namespace: config.config.Namespace,
          Qualifier: config.config.FunctionVersion,
        })
      ).Status === 'Active'
    )
      break
  }

  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[09/12]`)} 更新别名...`
  )

  try {
    logger.debug('[9.1/12] 检查别名状态...')
    await scf('GetAlias', tc.config, {
      Name: config.config.Namespace,
      FunctionName: config.config.FunctionName,
      Namespace: config.config.Namespace,
    })

    logger.debug('[9.2/12] 更新别名...')
    await scf('UpdateAlias', tc.config, {
      Name: config.config.Namespace,
      FunctionName: config.config.FunctionName,
      Namespace: config.config.Namespace,
      FunctionVersion: config.config.FunctionVersion,
    })
  } catch (error: any) {
    if (error.message.startsWith('ResourceNotFound.Alias')) {
      logger.debug('[9.2/12] 创建别名...')
      await scf('CreateAlias', tc.config, {
        Name: config.config.Namespace,
        FunctionName: config.config.FunctionName,
        FunctionVersion: config.config.FunctionVersion,
        Namespace: config.config.Namespace,
      })
    } else throw error
  }

  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[10/12]`)} 更新触发器...`
  )
  const triggers = await scf('ListTriggers', tc.config, {
    FunctionName: config.config.FunctionName,
    Namespace: config.config.Namespace,
  })
  for (const trigger of triggers.Triggers) {
    logger.debug('[10.1/12] 删除旧触发器: %s...', trigger.TriggerName)
    await scf('DeleteTrigger', tc.config, {
      FunctionName: config.config.FunctionName,
      Namespace: config.config.Namespace,
      TriggerName: trigger.TriggerName,
      Type: trigger.Type,
      Qualifier: trigger.Qualifier,
    })
  }

  if (config.config.triggers)
    for (const trigger of config.config.triggers) {
      logger.debug('[10.2/12] 创建触发器 %s...', trigger.name)
      await scf('CreateTrigger', tc.config, {
        FunctionName: config.config.FunctionName,
        TriggerName: trigger.name || trigger.type,
        Type: trigger.type,
        TriggerDesc: trigger.value,
        Qualifier: config.config.FunctionVersion,
        Namespace: config.config.Namespace,
        Enable: 'OPEN',
      })
    }

  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[11/12]`)} 更新预制并发...`
  )

  logger.debug('[11.1/12] 查询预制并发...')
  const current = await scf('GetProvisionedConcurrencyConfig', tc.config, {
    FunctionName: config.config.FunctionName,
    Namespace: config.config.Namespace,
  })
  if (current.Allocated.length)
    for (const allocated of current.Allocated) {
      logger.debug('[11.2/12] 删除旧预制并发 %j...', allocated)
      await scf('DeleteProvisionedConcurrencyConfig', tc.config, {
        FunctionName: config.config.FunctionName,
        Namespace: config.config.Namespace,
        Qualifier: allocated.Qualifier,
      })
    }

  if (config.config.provisionedConcurrent?.executions) {
    logger.debug(
      '[11/12] 添加预制并发 %s...',
      config.config.provisionedConcurrent.executions
    )
    await scf('PutProvisionedConcurrencyConfig', tc.config, {
      FunctionName: config.config.FunctionName,
      Namespace: config.config.Namespace,
      Qualifier: config.config.FunctionVersion,
      VersionProvisionedConcurrencyNum:
        config.config.provisionedConcurrent.executions,
    })
  }

  logger.raw(
    `${logger.colorfy(Color.GRAY, `${loggerPrefix}[12/12]`)} 清理文件...`
  )

  logger.debug('[12.1/12] 清理 Cos Bucket...')
  await remove(tc, {
    Bucket: config.config.Bucket,
    Key: config.config.CosObjectName,
    Region: config.config.Region,
  })

  if (process.env.FaasLog !== 'debug') {
    logger.debug('[12.2/12] 清理本地文件...')
    execSync(`rm -rf ${config.config.tmp}`)
  }

  logger.info(
    `云函数发布完成 ${data.env}#${data.name}#${config.config.FunctionVersion}`
  )
}
