/**
 * A tool to deploy a FaasJS function.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/deployer.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/deployer/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/deployer.svg)](https://www.npmjs.com/package/@faasjs/deployer)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/deployer
 * ```
 * @packageDocumentation
 */

import type { Func, DeployData } from '@faasjs/func'
import { existsSync, mkdirSync } from 'node:fs'
import { join, sep } from 'node:path'
import { loadConfig, loadTs } from '@faasjs/load'
import { Logger } from '@faasjs/logger'
import { deepMerge } from '@faasjs/deep_merge'
import { CloudFunction } from '@faasjs/cloud_function'
import { execSync } from 'node:child_process'

/** @deprecated */
export class Deployer {
  public deployData: DeployData
  public func?: Func

  constructor(data: DeployData) {
    console.warn('[@faasjs/deployer] Will deprecated in v3.')
    data.name = data.filename.replace(data.root, '').replace('.func.ts', '')
    data.version = new Date()
      .toLocaleString('zh-CN', {
        hour12: false,
        timeZone: 'Asia/Shanghai',
      })
      .replace(/[^0-9]+/g, '_')
    try {
      data.author = execSync('git config user.name')
        .toString()
        .replace(/\n/g, '')
    } catch (_) {
      data.author = 'Unknown'
    }

    data.logger = new Logger('Deployer')

    const Config = loadConfig(data.root, data.filename)

    if (!data.env) data.env = process.env.FaasEnv || Config.defaults.deploy.env

    data.config = Config[data.env]

    if (!data.config) throw Error(`Config load failed: ${data.env}`)

    data.tmp =
      join(
        process.cwd(),
        'tmp',
        data.env,
        data.name,
        data.version.replace(/_/g, '')
      ) + sep

    data.tmp.split(sep).reduce((acc: string, cur: string) => {
      acc += sep + cur
      if (!existsSync(acc)) mkdirSync(acc)

      return acc
    })

    this.deployData = data
  }

  public async deploy(): Promise<{
    [key: string]: any
    root: string
    filename: string
  }> {
    const data = this.deployData

    const loadResult = await loadTs(data.filename, { tmp: true })

    const func = loadResult.module
    if (!func) throw Error(`Func load failed: ${data.filename}`)

    if (func.config) data.config = deepMerge(data.config, func.config)

    data.dependencies = deepMerge(loadResult.dependencies, func.dependencies)

    // 按类型分类插件
    const includedCloudFunction: any[] = []
    for (let i = 0; i < func.plugins.length; i++) {
      const plugin = func.plugins[i]
      if (!plugin.type)
        throw Error(`[Deployer] Unknown plugin type: ${plugin.name}`)

      if (plugin.type === 'cloud_function')
        includedCloudFunction.push({
          index: i,
          plugin,
        })
    }

    // 将云函数插件移到最后
    if (includedCloudFunction.length > 0)
      for (const plugin of includedCloudFunction) {
        func.plugins.splice(plugin.index, 1)
        func.plugins.push(plugin.plugin)
      }
    else {
      const functionPlugin = new CloudFunction()
      func.plugins.push(functionPlugin)
    }

    await func.deploy(this.deployData)

    return this.deployData
  }
}
