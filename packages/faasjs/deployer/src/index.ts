import { Func, DeployData } from '@faasjs/func';
import { existsSync, mkdirSync } from 'fs';
import { loadConfig, loadTs } from '@faasjs/load';
import Logger from '@faasjs/logger';
import deepMerge from '@faasjs/deep_merge';
import { CloudFunction } from '@faasjs/cloud_function';

export class Deployer {
  public deployData: DeployData;
  public func?: Func;

  constructor (data: DeployData) {
    data.name = data.filename.replace(data.root, '').replace('.func.ts', '').replace(/^\/?[^/]+\//, '').replace(/\/$/, '');
    data.version = new Date().toLocaleString('zh-CN', {
      hour12: false,
      timeZone: 'Asia/Shanghai',
    }).replace(/(\/|:|\s)/g, '_');

    data.logger = new Logger('Deployer');

    const Config = loadConfig(data.root, data.filename);

    if (!data.env) {
      data.env = process.env.FaasEnv || Config.defaults.deploy.env;
    }

    data.config = Config[data.env!];

    if (!data.config) {
      throw Error(`Config load failed: ${data.env}`);
    }

    data.tmp = `${data.root}/tmp/${data.env}/${data.name}/${data.version}/`;

    data.tmp.split('/').reduce(function (acc: string, cur: string) {
      acc += '/' + cur;
      if (!existsSync(acc)) {
        mkdirSync(acc);
      }
      return acc;
    });

    this.deployData = data;
  }

  public async deploy () {
    const data = this.deployData;
    const loadResult = await loadTs(data.filename, { tmp: true });

    const func = loadResult.module;
    if (!func) {
      throw Error(`Func load failed: ${data.filename}`);
    }

    if (func.config) {
      data.config = deepMerge(data.config, func.config);
    }

    data.dependencies = deepMerge(loadResult.dependencies, func.dependencies);

    // 按类型分类插件
    let includedCloudFunction = [];
    for (let i = 0; i < func.plugins.length; i++) {
      const plugin = func.plugins[i as number];
      if (!plugin.type) {
        data.logger!.error('Unknow plugin type: %o', plugin);
        throw Error('[Deployer] Unknow plugin type');
      }

      if (plugin.type === 'cloud_function') {
        includedCloudFunction.push({
          index: i,
          plugin
        });
      }
    }

    // 将云函数插件移到最后
    if (includedCloudFunction.length) {
      for (const plugin of includedCloudFunction) {
        func.plugins.splice(plugin.index, 1);
        func.plugins.push(plugin.plugin);
      }
    } else {
      const functionPlugin = new CloudFunction();
      func.plugins.push(functionPlugin);
    }

    await func.deploy(this.deployData);

    return this.deployData;
  }
}
