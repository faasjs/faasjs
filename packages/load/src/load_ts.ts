import { deepMerge } from '@faasjs/deep_merge'
import { readFileSync, unlinkSync } from 'fs'
import { rollup } from 'rollup/dist/rollup.js'
import type { Plugin } from 'rollup'
import { Func } from '@faasjs/func'
import { join, sep, dirname } from 'path'
import { bundle, NodeBuiltinModules } from '@faasjs/ts-transform'

const FaasPackages = [
  '@faasjs/cloud_function',
  '@faasjs/deep_merge',
  '@faasjs/deployer',
  '@faasjs/func',
  '@faasjs/http',
  '@faasjs/knex',
  '@faasjs/load',
  '@faasjs/logger',
  '@faasjs/mongo',
  '@faasjs/redis',
  '@faasjs/request',
  '@faasjs/tencentcloud',
  '@faasjs/ts-transform',
]

// TODO: remove this when node fixed https://github.com/nodejs/node/issues/33460
function resolveModuleBasePath(moduleName: string) {
  const moduleMainFilePath = require.resolve(moduleName)

  const moduleNameParts = moduleName.split('/')

  let searchForPathSection

  if (moduleName.startsWith('@') && moduleNameParts.length > 1) {
    const [org, mod] = moduleNameParts
    searchForPathSection = `node_modules${sep}${org}${sep}${mod}`
  } else {
    const [mod] = moduleNameParts
    searchForPathSection = `node_modules${sep}${mod}`
  }

  const lastIndex = moduleMainFilePath.lastIndexOf(searchForPathSection)

  if (lastIndex === -1) {
    console.log(searchForPathSection, moduleMainFilePath)
    throw new Error(
      `Couldn't resolve the base path of "${moduleName}". Searched inside the resolved main file path "${moduleMainFilePath}" using "${searchForPathSection}"`
    )
  }

  return moduleMainFilePath.slice(0, lastIndex + searchForPathSection.length)
}

function findModule(
  list: any,
  key: string,
  options: {
    excludes?: string[]
  } = { excludes: [] }
) {
  if (list[key]) return

  if (key.startsWith('@types/') || options.excludes.includes(key)) return

  try {
    list[key] = dirname(require.resolve(join(key, 'package.json')))
  } catch (error) {
    console.warn(error)
    try {
      list[key] = resolveModuleBasePath(key)
    } catch (error) {
      console.warn(error)
    }
  }

  if (!list[key]) return

  // get package's dependencies
  const pkg = JSON.parse(
    readFileSync(join(list[key], 'package.json')).toString()
  )
  const deps = Object.keys(pkg.dependencies || {}).concat(
    Object.keys(pkg.peerDependencies || {})
  )

  // remove optional dependencies
  if (pkg.peerDependenciesMeta) {
    for (const key of Object.keys(pkg.peerDependenciesMeta)) {
      if (pkg.peerDependenciesMeta[key].optional) {
        const index = deps.indexOf(key)
        if (index >= 0) deps.splice(index, 1)
      }
    }
  }

  // import dependencies
  deps.map(d => findModule(list, d, options))
}

function swc(externalModules: string[]): Plugin {
  return {
    name: 'swc',
    async transform(code, filename) {
      return bundle({
        filename,
        externalModules,
      })
    },
  }
}

/**
 * 加载 ts 文件
 *
 * @param filename {string} 完整源文件路径
 * @param options {object} 配置项
 * @param options.input {object} 读取配置
 * @param options.output {object} 写入配置
 * @param options.tmp {boolean} 是否为临时文件，true 则生成的文件会被删除，默认为 false
 * @param options.modules {object} 生成 modules 的配置
 * @param options.modules.excludes {string[]} modules 中需排除的模块
 */
export async function loadTs(
  filename: string,
  options: {
    input?: {
      [key: string]: any
    }
    output?: {
      [key: string]: any
    }
    tmp?: boolean
    modules?: {
      excludes?: string[]
      additions?: string[]
    }
  } = Object.create(null)
): Promise<{
  module?: Func
  dependencies: {
    [key: string]: string
  }
  modules?: {
    [key: string]: string
  }
}> {
  const PackageJSON = require(`${process.cwd()}/package.json`)
  const external = PackageJSON.dependencies
    ? Object.keys(PackageJSON.dependencies)
    : []
  if (options.modules && options.modules.excludes == null)
    options.modules.excludes = []

  const input = deepMerge(
    {
      input: filename,
      external,
      plugins: [swc(external.concat(FaasPackages))],
      onwarn: () => null as any,
    },
    options.input || {}
  )

  const bundle = await rollup(input)

  const dependencies = Object.create(null)

  for (const m of bundle.cache?.modules || [])
    for (const d of m.dependencies)
      if (
        !d.startsWith('/') &&
        !dependencies[d] &&
        !NodeBuiltinModules.includes(d)
      )
        dependencies[d] = '*'

  const output = deepMerge(
    {
      file: `${filename}.tmp.js`,
      format: 'cjs',
      exports: 'auto',
    },
    options.output || {}
  )

  await bundle.write(output)

  const result = Object.create(null)

  result.dependencies = dependencies

  result.module = require(output.file)

  if (options.tmp) unlinkSync(output.file)

  if (options.modules) {
    const modules = Object.create(null)

    Object.keys(dependencies).map(d => findModule(modules, d, options.modules))
    if (options.modules.additions)
      options.modules.additions.map(d =>
        findModule(modules, d, options.modules)
      )

    result.modules = modules
  }

  return result
}
