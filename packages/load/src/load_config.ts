import deepMerge from '@faasjs/deep_merge';
import { existsSync, readFileSync } from 'fs';
import { sep, dirname, join } from 'path';
import { safeLoad } from 'js-yaml';
import { Config as FuncConfig } from '@faasjs/func';

/**
 * 配置类
 */
export class Config {
  public readonly root: string;
  public readonly filename: string;
  public readonly origin: {
    defaults: FuncConfig;
    [key: string]: FuncConfig;
  }
  public readonly defaults: FuncConfig;
  [key: string]: any;

  /**
   * 创建配置类，并自动读取配置内容
   * 
   * @param root {string} 根目录
   * @param filename {filename} 目标文件，用于读取目录层级
   */
  constructor (root: string, filename: string) {
    this.root = root;

    if (!this.root.endsWith(sep)) {
      this.root += sep;
    }

    this.filename = filename;

    const configs: { [key: string]: FuncConfig }[] = [];

    const paths = [this.root, '.'].concat(dirname(filename.replace(root, '')).split(sep));

    paths.reduce(function (base, path) {
      const root = join(base, path);
      const faas = join(root, 'faas.yaml');

      if (existsSync(faas)) {
        configs.push(safeLoad(readFileSync(faas).toString()));
      }

      return root;
    });

    this.origin = deepMerge(...configs);

    if (!this.origin.defaults) {
      throw Error('[faas.yaml] need defaults env.');
    }

    this.defaults = deepMerge(this.origin.defaults);

    for (const key in this.origin) {
      if (key !== 'defaults') {
        this[key as string] = deepMerge(this.origin.defaults, this.origin[key as string]);
      }

      const data = this[key as string];

      if (!data.providers) {
        throw Error(`[faas.yaml] missing key: ${key}/providers`);
      }

      if (!data.plugins) {
        throw Error(`[faas.yaml] missing key: ${key}/plugins`);
      }

      for (const pluginKey in data.plugins) {
        const plugin = data.plugins[pluginKey as string];
        plugin.name = pluginKey;
        if (plugin.provider) {
          if (typeof plugin.provider === 'string') {
            if (!data.providers[plugin.provider]) {
              throw Error(`[faas.yaml] missing provider: ${plugin.provider} <${key}/plugins/${pluginKey}>`);
            }
            plugin.provider = data.providers[plugin.provider];
          } else {
            plugin.provider = deepMerge(data.providers[plugin.provider], plugin.provider);
          }
        }
      }
    }
  }
}

/**
 * 加载配置
 * @param root {string} 根目录
 * @param filename {filename} 目标文件，用于读取目录层级
 */
export default function loadConfig (root: string, filename: string): Config {
  return new Config(root, filename);
}
