import { DeployData } from '@faasjs/func';
import deepMerge from '@faasjs/deep_merge';
import Logger, { Color } from '@faasjs/logger';
import { execSync } from 'child_process';
import { checkBucket, createBucket, upload, remove } from './cos';
import scf from './scf';
import Tencentcloud from '..';
import { join } from 'path';

const defaults = {
  Handler: 'index.handler',
  MemorySize: 64,
  Timeout: 30,
  Runtime: 'Nodejs12.16'
};

// 腾讯云内置插件 https://cloud.tencent.com/document/product/583/11060
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
  '@faasjs/load'
];

function exec (cmd: string): void {
  if (process.env.FaasLog === 'debug')
    execSync(cmd, { stdio: 'inherit' });
  else
    execSync(cmd);
}

export default async function deployCloudFunction (tc: Tencentcloud, data: DeployData, origin: any): Promise<void> {
  if (!tc.config || !tc.config.secretId || !tc.config.secretKey) throw Error('Missing secretId or secretKey!');

  const logger = new Logger(`${data.env}#${data.name}`);

  const loggerPrefix = `[${data.env}#${data.name}]`;
  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[01/11]')} 生成配置项...`);

  const config = deepMerge(origin);

  // 补全默认参数
  if (config.config.name) {
    config.config.FunctionName = config.config.name;
    delete config.config.name;
  } else
    config.config.FunctionName = data.name.replace(/[^a-zA-Z0-9-_]/g, '_');

  if (!config.config.Description) config.config.Description = `Source: ${data.name}\nPublished by ${process.env.LOGNAME}\nPublished at ${config.config.version}`;

  if (config.config.memorySize) {
    config.config.MemorySize = config.config.memorySize;
    delete config.config.memorySize;
  }
  if (config.config.timeout) {
    config.config.Timeout = config.config.timeout;
    delete config.config.timeout;
  }

  config.config = deepMerge(defaults, config.config, {
    // 基本参数
    Region: config.provider.config.region,
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

    // 构建参数
    filename: data.filename,
    name: data.name,
    version: data.version,
    env: data.env,
    dependencies: data.dependencies,
    tmp: data.tmp,

    // cos 参数
    Bucket: `scf-${config.provider.config.appId}`,
    FilePath: `${data.tmp}deploy.zip`,
    CosObjectName: data.env + '/' + config.config.FunctionName + '/' + data.version + '.zip'
  });

  logger.debug('[01/11] 完成配置项 %o', config);

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[02/11]')} 生成代码包...`);

  logger.debug('[2.1/11] 生成 index.js...');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ts = await require('@faasjs/load').loadTs(config.config.filename, {
    output: {
      file: config.config.tmp + '/index.js',
      format: 'cjs',
      name: 'index',
      banner: `/**
 * @name ${config.config.name}
 * @author ${process.env.LOGNAME}
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
  });

  logger.debug('%o', ts.modules);

  logger.debug('[2.2/11] 生成 node_modules...');
  for (const key in ts.modules) {
    const target = join(config.config.tmp, 'node_modules', key);
    exec(`mkdir -p ${target}`);
    exec(`rsync -avhpr --exclude={'*.cache','*.bin','LICENSE','license','ChangeLog','CHANGELOG','*.ts','*.flow','*.map','*.md'} ${join(ts.modules[key], '*')} ${target}`);
  }

  exec(`rm -rf ${join(config.config.tmp, 'node_modules', '*', 'node_modules')}`);

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[03/11]')} 打包代码包...`);
  exec(`cd ${config.config.tmp} && zip -r deploy.zip *`);

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[04/11]')} 检查 COS...`);

  try {
    logger.debug('[4.1/11] 检查 Cos Bucket 状态');
    await checkBucket(tc, {
      Bucket: config.config.Bucket,
      Region: config.config.Region
    });
    logger.debug('[4.2/11] Cos Bucket 已存在，跳过');
  } catch (error) {
    logger.debug('[4.2/11] 创建 Cos Bucket...');
    await createBucket(tc, {
      Bucket: config.config.Bucket,
      Region: config.config.Region
    });
  }

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[05/11]')} 上传代码包...`);
  await upload(tc, {
    Bucket: config.config.Bucket,
    FilePath: config.config.FilePath,
    Key: config.config.CosObjectName,
    Region: config.config.Region,
  });

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[06/11]')} 检查命名空间...`);
  logger.debug('[6.1/11] 检查命名空间状态');
  const namespaceList = await scf(tc, { Action: 'ListNamespaces' });
  if (!namespaceList.Namespaces.find((n: any) => n.Name === config.config.Namespace)) {
    logger.debug('[6.2/11] 创建命名空间...');
    await scf(tc, {
      Action: 'CreateNamespace',
      Namespace: config.config.Namespace
    });
  } else
    logger.debug('[6.2/11] 命名空间已存在，跳过');

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[07/11]')} 上传云函数...`);

  try {
    logger.debug('[7.1/11] 检查云函数是否已存在...');
    await scf(tc, {
      Action: 'GetFunction',
      FunctionName: config.config.FunctionName,
      Namespace: config.config.Namespace,
    });

    logger.debug('[7.2/11] 更新云函数代码...');
    await scf(tc, {
      Action: 'UpdateFunctionCode',
      CosBucketName: 'scf',
      CosBucketRegion: config.config.Region,
      CosObjectName: config.config.CosObjectName,
      FunctionName: config.config.FunctionName,
      Handler: config.config.Handler,
      Namespace: config.config.Namespace,
    });

    let status = null;
    while (status !== 'Active') {
      logger.debug('[7.3/11] 等待云函数代码更新完成...');

      status = await scf(tc, {
        Action: 'GetFunction',
        FunctionName: config.config.FunctionName,
        Namespace: config.config.Namespace
      }).then(res => res.Status);
    }

    logger.debug('[7.2/11] 更新云函数配置...');
    await scf(tc, {
      Action: 'UpdateFunctionConfiguration',
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
      InitTimeout: config.config.InitTimeout
    });

    status = null;
    while (status !== 'Active') {
      logger.debug('[7.3/11] 等待云函数配置更新完成...');

      status = await scf(tc, {
        Action: 'GetFunction',
        FunctionName: config.config.FunctionName,
        Namespace: config.config.Namespace
      }).then(res => res.Status);
    }
  } catch (error) {
    if (error.Code.startsWith('ResourceNotFound')) {
      logger.debug('[7.2/11] 创建云函数...');
      await scf(tc, {
        Action: 'CreateFunction',
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
        InitTimeout: config.config.InitTimeout
      });

      // eslint-disable-next-line no-constant-condition
      while (true) {
        logger.debug('[7.3/11] 等待云函数代码更新完成...');
        if ((await scf(tc, {
          Action: 'GetFunction',
          FunctionName: config.config.FunctionName,
          Namespace: config.config.Namespace
        })).Status === 'Active') break;
      }
    } else
      throw error;
  }

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[08/11]')} 发布版本...`);

  const version = await scf(tc, {
    Action: 'PublishVersion',
    Description: `Published by ${process.env.LOGNAME}`,
    FunctionName: config.config.FunctionName,
    Namespace: config.config.Namespace
  });
  config.config.FunctionVersion = version.FunctionVersion;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    logger.debug('[8.1/11] 等待版本发布完成...');
    if ((await scf(tc, {
      Action: 'GetFunction',
      FunctionName: config.config.FunctionName,
      Namespace: config.config.Namespace,
      Qualifier: config.config.FunctionVersion
    })).Status === 'Active') break;
  }

  // logger.raw(`${logger.colorfy(Color.GRAY, '[09/11]')} 更新别名...`);

  // try {
  //   logger.debug('[9.1/11] 检查别名状态...');
  //   await scf(tc, {
  //     Action: 'GetAlias',
  //     Name: config.config.Namespace,
  //     FunctionName: config.config.FunctionName,
  //     Namespace: config.config.Namespace
  //   });

  //   logger.info('[9.2/11] 更新别名...');
  //   await scf(tc, {
  //     Action: 'UpdateAlias',
  //     Name: config.config.Namespace,
  //     FunctionName: config.config.FunctionName,
  //     Namespace: config.config.Namespace,
  //     FunctionVersion: config.config.FunctionVersion,
  //   });
  // } catch (error) {
  //   if (error.Code === 'ResourceNotFound.Alias') {
  //     logger.info('[9.2/11] 创建别名...');
  //     await scf(tc, {
  //       Action: 'CreateAlias',
  //       Name: config.config.Namespace,
  //       FunctionName: config.config.FunctionName,
  //       FunctionVersion: config.config.FunctionVersion,
  //       Namespace: config.config.Namespace
  //     });
  //   } else
  //     throw error;
  // }

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[10/11]')} 更新触发器...`);
  const triggers = await scf(tc, {
    Action: 'ListTriggers',
    FunctionName: config.config.FunctionName,
    Namespace: config.config.Namespace
  });
  for (const trigger of triggers.Triggers) {
    logger.debug('[10.1/11] 删除旧触发器: %s...', trigger.TriggerName);
    await scf(tc, {
      Action: 'DeleteTrigger',
      FunctionName: config.config.FunctionName,
      Namespace: config.config.Namespace,
      TriggerName: trigger.TriggerName,
      Type: trigger.Type,
      Qualifier: trigger.Qualifier
    });
  }

  if (config.config.triggers)
    for (const trigger of config.config.triggers) {
      logger.debug('[10.2/11] 创建触发器 %s...', trigger.name);
      await scf(tc, {
        Action: 'CreateTrigger',
        FunctionName: config.config.FunctionName,
        TriggerName: trigger.name || trigger.type,
        Type: trigger.type,
        TriggerDesc: trigger.value,
        Qualifier: config.config.FunctionVersion,
        Namespace: config.config.Namespace,
        Enable: 'OPEN'
      });
    }

  logger.raw(`${logger.colorfy(Color.GRAY, loggerPrefix + '[11/11]')} 清理文件...`);

  logger.debug('[11.1/11] 清理 Cos Bucket...');
  await remove(tc, {
    Bucket: config.config.Bucket,
    Key: config.config.CosObjectName,
    Region: config.config.Region,
  });

  if (process.env.FaasLog !== 'debug') {
    logger.debug('[11.2/11] 清理本地文件...');
    exec(`rm -rf ${config.config.tmp}`);
  }
}
