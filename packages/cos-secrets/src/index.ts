import { Plugin, MountData, Next, usePlugin, UseifyPlugin } from '@faasjs/func';
import Logger from '@faasjs/logger';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import deepMerge from '@faasjs/deep_merge';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const COS = require('cos-nodejs-sdk-v5');

function dataToEnv (data: any, parent: string = ''): void {
  for (const key in data)
    if (Object.prototype.toString.call(data[key]) === '[object Object]')
      dataToEnv(data[key], parent ? `${parent}_${key}` : key);
    else
      process.env[['SECRET', parent.toUpperCase(), key.toUpperCase()].filter(k => !!k).join('_')] = data[key];
}

interface Config {
  bucket?: string;
  region?: string;
  key?: string;
  files?: string[];
}

export interface CosSecretsConfig {
  name?: string;
  config?: Config;
}

const Name = 'cos_secrets';

const globals: {[name: string]: CosSecrets} = {};

export class CosSecrets implements Plugin {
  public readonly type: string = Name;
  public readonly name: string = Name;
  public config: Config;
  public data: { [key: string]: any };
  private logger: Logger;

  constructor (config?: {
    name?: string;
    config?: Config;
  }) {
    if (config) {
      this.name = config.name || this.type;
      this.config = config.config || Object.create(null);
    } else {
      this.name = this.type;
      this.config = Object.create(null);
    }

    this.logger = new Logger(this.name);
  }

  async onMount (data: MountData, next: Next): Promise<void> {
    if (data.config.plugins[this.name])
      this.config = deepMerge(data.config.plugins[this.name].config, this.config);
    if (!this.config.key) this.config.key = `${process.env.FaasEnv}/secrets.json`;

    if (process.env.FaasMode === 'local') {
      this.logger.debug('Local mode');
      const file = join(process.cwd(), `secrets.${process.env.FaasEnv}.json`);
      if (existsSync(file)) {
        const env = readFileSync(file).toString();
        dataToEnv(JSON.parse(env));
      } else
        this.logger.warn(`Not found ${file}.`);
    } else {
      this.logger.debug('Loading from %O', this.config);

      const client = new COS({
        getAuthorization: function (_, cb): void {
          cb({
            TmpSecretId: process.env.TENCENTCLOUD_SECRETID,
            TmpSecretKey: process.env.TENCENTCLOUD_SECRETKEY,
            XCosSecurityToken: process.env.TENCENTCLOUD_SESSIONTOKEN,
            ExpiredTime: Date.now() / 1000
          });
        }
      });

      // eslint-disable-next-line @typescript-eslint/typedef
      await new Promise((resolve, reject) => {
        client.getObject({
          Bucket: this.config.bucket,
          Region: this.config.region,
          Key: this.config.key
          // eslint-disable-next-line @typescript-eslint/typedef
        }, (err, data) => {
          if (err) reject(err);
          this.data = JSON.parse(data.Body);
          dataToEnv(this.data);
          resolve();
        });
      });

      if (this.config.files && this.config.files.length)
        for (const file of this.config.files)
          // eslint-disable-next-line @typescript-eslint/typedef
          await new Promise((resolve, reject) => {
            client.getObject({
              Bucket: this.config.bucket,
              Region: this.config.region,
              Key: process.env.FaasEnv + '/' + file
              // eslint-disable-next-line @typescript-eslint/typedef
            }, (err, data) => {
              if (err) reject(err);
              const path = `/tmp/${file}`;
              mkdirSync(dirname(path), { recursive: true });
              writeFileSync(path, data.Body);
              this.logger.debug('write: %s', path);
              resolve();
            });
          });
    }

    globals[this.name] = this;

    await next();
  }
}

export function useCosSecrets (config?: CosSecretsConfig): CosSecrets & UseifyPlugin {
  const name = config?.name || Name;

  if (globals[name]) return usePlugin<CosSecrets>(globals[name]);

  return usePlugin<CosSecrets>(new CosSecrets(config));
}
