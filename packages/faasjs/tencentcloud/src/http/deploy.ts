import { DeployData } from '@faasjs/func';
import api from './api';
import deepMerge from '@faasjs/deep_merge';
import Tencentcloud from '..';

const defaults = {
  authRequired: 'FALSE',
  enableCORS: 'TRUE',
  'requestConfig.method': 'POST',
  serviceType: 'SCF',
  serviceScfIsIntegratedResponse: 'TRUE',
  serviceTimeout: 30
};

export default async function (this: Tencentcloud, data: DeployData, origin: any) {
  this.logger.info('开始发布网关');

  const config = deepMerge(origin);

  // 参数名适配
  config.config['requestConfig.path'] = config.config.path;
  delete config.config.path;

  if (config.config.method) {
    config.config['requestConfig.method'] = config.config.method;
    delete config.config.method;
  }
  if (config.config.timeout) {
    config.config.serviceTimeout = config.config.timeout;
    delete config.config.timeout;
  }
  if (config.config.functionName) {
    config.config.serviceScfFunctionName = config.config.functionName;
    delete config.config.functionName;
  } else {
    config.config.serviceScfFunctionName = data.name!.replace(/[^a-zA-Z0-9-_]/g, '_');
  }

  // 合并配置项
  config.config = deepMerge(defaults, config.config, {
    apiName: data.name,
    serviceScfFunctionNamespace: data.env,
    serviceScfFunctionQualifier: data.env
  });

  const provider = config.provider.config;

  this.logger.debug('查询服务信息 %s', data.env);
  let serviceInfo = await api(provider, {
    Action: 'DescribeServicesStatus',
    searchName: data.env
  }).then(function (body) {
    return body.serviceStatusSet.find(function (item: any) {
      return item.serviceName === data.env;
    });
  });

  if (!serviceInfo) {
    this.logger.info('服务不存在，创建服务 %s', data.env);
    serviceInfo = await api(provider, {
      Action: 'CreateService',
      serviceName: data.env,
      protocol: 'http&https'
    }).then(function (body) { return body.data; });
  }

  this.logger.debug('查询接口是否存在 %s %s', serviceInfo.serviceId, config.config['requestConfig.path']);

  let apiInfo = await api(provider, {
    Action: 'DescribeApisStatus',
    searchName: config.config['requestConfig.path'],
    serviceId: serviceInfo.serviceId,
  }).then(function (body) {
    return body.apiIdStatusSet.find(function (item: any) {
      return item.path === config.config['requestConfig.path'];
    });
  });

  if (apiInfo) {
    apiInfo = await api(provider, {
      Action: 'DescribeApi',
      serviceId: serviceInfo.serviceId,
      apiId: apiInfo.apiId
    });
    if (
      apiInfo.serviceType !== 'SCF' ||
      apiInfo.serviceTimeout !== config.config.serviceTimeout ||
      apiInfo.serviceScfFunctionName !== config.config.serviceScfFunctionName ||
      apiInfo.serviceScfFunctionNamespace !== config.config.serviceScfFunctionNamespace ||
      apiInfo.serviceScfFunctionQualifier !== config.config.serviceScfFunctionQualifier) {
      this.logger.info('更新接口');
      await api(provider, Object.assign(config.config, {
        Action: 'ModifyApi',
        apiId: apiInfo.apiId,
      }));
    } else {
      this.logger.info('网关无需更新 %s %s', config.config['requestConfig.method'], config.config['requestConfig.path']);
      return;
    }
  } else {
    this.logger.info('接口不存在，创建接口');
    await api(provider, Object.assign(config.config, {
      Action: 'CreateApi',
      serviceId: serviceInfo.serviceId,
    }));
  }

  this.logger.info('发布网关');

  await api(provider, {
    Action: 'ReleaseService',
    environmentName: 'release',
    releaseDesc: `Published ${config.config.serviceScfFunctionName} by ${process.env.LOGNAME}`,
    serviceId: serviceInfo.serviceId,
  });

  this.logger.info('网关发布完成 %s %s', config.config['requestConfig.method'], config.config['requestConfig.path']);
}
