import { Plugin, MountData, Next } from '@faasjs/func';
import deepMerge from '@faasjs/deep_merge';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const COS = require('cos-nodejs-sdk-v5');

function dataToEnv (data: any, parent: string = ''): void {
  for (const key in data) 
    if (Object.prototype.toString.call(data[key]) === '[object Object]') 
      dataToEnv(data[key], key);
    else
      process.env[['SECRET', parent.toUpperCase(), key.toUpperCase()].filter(k => !!k).join('_')] = data[key];
}

export interface CosSecretsConfig {
  bucket?: string;
  region?: string;
  key?: string;
}

export class CosSecrets implements Plugin {
  public readonly type: string = 'cosSecrets';
  public name: string;
  public config: CosSecretsConfig;
  public data: { [key: string]: any };

  constructor (config?: {
    name: string;
    config: CosSecretsConfig;
  }) {
    if (config) {
      this.name = config.name || this.type;
      this.config = config.config || {};
    } else {
      this.name = this.type;
      this.config = {};
    }
  }

  async onMount (data: MountData, next: Next): Promise<void> {
    if (data.config.plugins[this.name])
      this.config = deepMerge(data.config.plugins[this.name].config, this.config);
    if (!this.config.key) this.config.key = `${process.env.FaasEnv}/secrets.json`;

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

    await next();
  }
}
