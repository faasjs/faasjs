import { DeployData } from '@faasjs/func';
import deepMerge from '@faasjs/deep_merge';
import { loadTs } from '@faasjs/load';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { checkBucket, createBucket, upload, remove } from './cos';
import scf from './scf';
import Tencentcloud from '..';

const defaults = {
  Handler: 'index.handler',
  MemorySize: 64,
  Timeout: 30,
  Runtime: 'Nodejs8.9'
};

function loadDependents (packageJSON, dependencies) {
  for (const key in dependencies) {
    const path = join(process.cwd(), 'node_modules', key, 'package.json');
    if (!existsSync(path)) continue;

    const subPackage = JSON.parse(readFileSync(path).toString());
    if (subPackage.dependencies) {
      for (const subKey in subPackage.dependencies) {
        if (!packageJSON.dependencies[subKey as string]) {
          const subPath = join(process.cwd(), 'node_modules', subKey);
          if (!existsSync(subPath)) continue;

          packageJSON.dependencies[subKey as string] = `file:${subPath}`;

          const subSubPackage = JSON.parse(readFileSync(join(subPath, 'package.json')).toString());
          loadDependents(packageJSON, subSubPackage.dependencies);
        }
      }
    }
    packageJSON.dependencies[key as string] = `file:${join(process.cwd(), 'node_modules', key)}`;
  }
}

function exec (cmd: string) {
  if (process.env.FaasLog === 'debug') {
    execSync(cmd, { stdio: 'inherit' });
  } else {
    execSync(cmd);
  }
}

export default async function deployCloudFunction (this: Tencentcloud, data: DeployData, origin: any) {
  this.logger.info('[0/12] 开始发布云函数');

  if (!this.config || !this.config.secretId || !this.config.secretKey) throw Error('Missing secretId or secretKey!');

  const config = deepMerge(origin);

  this.logger.info('[1/12] 生成配置项');
  // 补全默认参数
  if (config.config.name) {
    config.config.FunctionName = config.config.name;
    delete config.config.name;
  } else {
    config.config.FunctionName = data.name!.replace(/[^a-zA-Z0-9-_]/g, '_');
  }
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
    CosObjectName: config.config.FunctionName + '/' + data.version + '.zip'
  });

  this.logger.debug('[1/12] 完成配置项 %o', config);

  this.logger.info('[2/12] 生成代码包');

  this.logger.debug('[2.1/12] 生成 index.js');
  await loadTs(config.config.filename, {
    output: {
      file: config.config.tmp + '/index.js',
      format: 'cjs',
      name: 'index',
      banner: `/**
 * @name ${config.config.name}
 * @author ${process.env.LOGNAME}
 * @build ${config.config.version}
 * @staging ${config.config.env}
 * @dependencies ${JSON.stringify(config.config.dependencies)}
 */`,
      footer: `
const main = module.exports;
main.config = ${JSON.stringify(data.config, null, 2)};
module.exports = main.export();`
    }
  });

  this.logger.debug('[2.2/12] 生成 package.json');
  const packageJSON = {
    dependencies: config.config.dependencies,
    private: true
  };

  loadDependents(packageJSON, packageJSON.dependencies);

  writeFileSync(join(config.config.tmp, 'package.json'), JSON.stringify(packageJSON));
  this.logger.debug('%o', packageJSON);

  this.logger.debug('[2.3/12] 生成 node_modules');
  exec(`yarn --cwd ${config.config.tmp} install --production --offline`);

  this.logger.info('[3/12] 打包代码包: %s', config.config.tmp);
  exec(`cd ${config.config.tmp} && zip -r deploy.zip *`);

  this.logger.info('[4/12] 创建 Cos Bucket: %s', config.config.Bucket);
  this.logger.debug('[4.1/12] 检查 Cos Bucket 状态');
  try {
    await checkBucket.call(this, {
      Bucket: config.config.Bucket,
      Region: config.config.Region
    });
    this.logger.debug('[4.2/12] Cos Bucket 已存在，跳过');
  } catch (error) {
    this.logger.debug('[4.2/12] 创建 Cos Bucket');
    await createBucket.call(this, {
      Bucket: config.config.Bucket,
      Region: config.config.Region
    });
  }

  this.logger.info('[5/12] 上传代码包到 Cos Bucket: %s', config.config.FilePath);
  await upload.call(this, {
    Bucket: config.config.Bucket,
    FilePath: config.config.FilePath,
    Key: config.config.CosObjectName,
    Region: config.config.Region,
  });

  this.logger.info('[6/12] 创建命名空间: %s', config.config.Namespace);
  this.logger.debug('[6.1/12] 检查命名空间状态');
  const namespaceList = await scf.call(this, {
    Action: 'ListNamespaces'
  });
  if (!namespaceList.Namespaces.find(function (n: any) {
    return n.Name === config.config.Namespace;
  })) {
    this.logger.debug('[6.2/12] 创建命名空间');
    await scf.call(this, {
      Action: 'CreateNamespace',
      Namespace: config.config.Namespace
    });
  } else {
    this.logger.debug('[6.2/12] 命名空间已存在，跳过');
  }


  this.logger.info('[7/12] 创建/更新云函数: %s', config.config.FunctionName);

  let scfInfo;

  try {
    this.logger.debug('[7.1/12] 检查云函数是否已存在');
    scfInfo = await scf.call(this, {
      Action: 'GetFunction',
      FunctionName: config.config.FunctionName,
      Namespace: config.config.Namespace,
    });

    this.logger.debug('[7.2/12] 更新云函数代码');
    await scf.call(this, {
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
      this.logger.debug('[7.3/12] 等待云函数代码更新完成');

      status = await scf.call(this, {
        Action: 'GetFunction',
        FunctionName: config.config.FunctionName,
        Namespace: config.config.Namespace
      }).then(res => res.Status);
    }

    this.logger.debug('[7.2/12] 更新云函数配置');
    await scf.call(this, {
      Action: 'UpdateFunctionConfiguration',
      Environment: config.config.Environment,
      FunctionName: config.config.FunctionName,
      MemorySize: config.config.MemorySize,
      Timeout: config.config.Timeout,
      VpcConfig: config.config.VpcConfig,
      Namespace: config.config.Namespace,
    });

    status = null;
    while (status !== 'Active') {
      this.logger.debug('[7.3/12] 等待云函数配置更新完成');

      status = await scf.call(this, {
        Action: 'GetFunction',
        FunctionName: config.config.FunctionName,
        Namespace: config.config.Namespace
      }).then(res => res.Status);
    }
  } catch (error) {
    if (error.Code === 'ResourceNotFound.FunctionName') {
      this.logger.debug('[7.2/12] 创建云函数');
      await scf.call(this, {
        Action: 'CreateFunction',
        Code: {
          CosBucketName: 'scf',
          CosBucketRegion: config.config.Region,
          CosObjectName: config.config.CosObjectName,
        },
        Environment: config.config.Environment,
        FunctionName: config.config.FunctionName,
        Handler: config.config.Handler,
        Namespace: config.config.Namespace,
        MemorySize: config.config.MemorySize,
        Runtime: config.config.Runtime,
        Timeout: config.config.Timeout,
        VpcConfig: config.config.VpcConfig,
      });

      let status = null;
      while (status !== 'Active') {
        this.logger.debug('[7.3/12] 等待云函数代码更新完成');

        status = await scf.call(this, {
          Action: 'GetFunction',
          FunctionName: config.config.FunctionName,
          Namespace: config.config.Namespace
        }).then(res => res.Status);
      }
    } else {
      throw error;
    }
  }

  this.logger.info('[8/12] 发布版本');

  const version = await scf.call(this, {
    Action: 'PublishVersion',
    Description: `Published by ${process.env.LOGNAME}`,
    FunctionName: config.config.FunctionName,
    Namespace: config.config.Namespace
  });
  // eslint-disable-next-line require-atomic-updates
  config.config.FunctionVersion = version.FunctionVersion;

  let status = null;
  while (status !== 'Active') {
    this.logger.debug('[8.1/12] 等待版本发布完成');

    status = await scf.call(this, {
      Action: 'GetFunction',
      FunctionName: config.config.FunctionName,
      Namespace: config.config.Namespace
    }).then(res => res.Status);
  }

  // 别名功能故障，暂时禁用
  // this.logger.info('[9/12] 创建/更新别名: %s', config.config.Namespace);

  // try {
  //   this.logger.debug('[9.1/12] 检查别名状态');
  //   await scf.call(this, {
  //     Action: 'GetAlias',
  //     Name: config.config.Namespace,
  //     FunctionName: config.config.FunctionName,
  //     Namespace: config.config.Namespace
  //   });

  //   this.logger.info('[9.2/12] 更新别名');
  //   await scf.call(this, {
  //     Action: 'UpdateAlias',
  //     Name: config.config.Namespace,
  //     FunctionName: config.config.FunctionName,
  //     Namespace: config.config.Namespace,
  //     FunctionVersion: config.config.FunctionVersion,
  //   });
  // } catch (error) {
  //   if (error.Code === 'ResourceNotFound.Alias') {
  //     this.logger.info('[9.2/12] 创建别名');
  //     await scf.call(this, {
  //       Action: 'CreateAlias',
  //       Name: config.config.Namespace,
  //       FunctionName: config.config.FunctionName,
  //       FunctionVersion: config.config.FunctionVersion,
  //       Namespace: config.config.Namespace
  //     });
  //   } else {
  //     throw error;
  //   }
  // }


  this.logger.info('[10/12] 创建/更新/删除触发器: %o', config.config.triggers);
  const prevVersion = Number(config.config.FunctionVersion) - 1;
  if (scfInfo && scfInfo.Triggers.length) {
    for (const trigger of scfInfo.Triggers) {
      this.logger.debug('[10.1/12] 删除已有触发器: %s', trigger.TriggerName);
      await scf.call(this, {
        Action: 'DeleteTrigger',
        FunctionName: config.config.FunctionName,
        Namespace: config.config.Namespace,
        TriggerName: trigger.TriggerName,
        Type: trigger.Type,
        Qualifier: prevVersion
      });
    }
  }
  if (prevVersion) {
    scfInfo = await scf.call(this, {
      Action: 'GetFunction',
      FunctionName: config.config.FunctionName,
      Namespace: config.config.Namespace,
      Qualifier: prevVersion,
    });
    if (scfInfo.Triggers.length) {
      for (const trigger of scfInfo.Triggers) {
        this.logger.debug('[10.1/12] 删除旧版本触发器: %s', trigger.TriggerName);
        await scf.call(this, {
          Action: 'DeleteTrigger',
          FunctionName: config.config.FunctionName,
          Namespace: config.config.Namespace,
          Qualifier: prevVersion,
          TriggerName: trigger.TriggerName,
          Type: trigger.Type
        });
      }
    }

    if (config.config.triggers) {
      for (const trigger of config.config.triggers) {
        this.logger.debug('[10.2/12] 创建触发器 %o', trigger);
        await scf.call(this, {
          Action: 'CreateTrigger',
          FunctionName: config.config.FunctionName,
          TriggerName: trigger.name,
          Type: trigger.type,
          TriggerDesc: trigger.value,
          Qualifier: config.config.FunctionVersion,
          Namespace: config.config.Namespace,
          Enable: 'OPEN'
        });
      }
    }
  }

  this.logger.info('[11/12] 清理文件');

  this.logger.debug('[11.1/12] 清理 Cos Bucket: %s', config.config.CosObjectName);
  await remove.call(this, {
    Bucket: config.config.Bucket,
    Key: config.config.CosObjectName,
    Region: config.config.Region,
  });
  
  this.logger.debug('[11.2/12] 清理本地文件: %s', config.config.tmp);
  exec(`rm -rf ${config.config.tmp}`);

  this.logger.info('[12/12] 完成发布 %s/%s@%s', config.config.Namespace, config.config.FunctionName, config.config.FunctionVersion);
}
