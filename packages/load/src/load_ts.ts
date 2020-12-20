import deepMerge from '@faasjs/deep_merge';
import { unlinkSync } from 'fs';
import * as rollup from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import { Func } from '@faasjs/func';

const FAAS_PACKAGES = [
  '@faasjs/browser',
  '@faasjs/cli',
  '@faasjs/cloud_function',
  'create-faas-app',
  '@faasjs/deep_merge',
  '@faasjs/deployer',
  '@faasjs/eslint-config-recommended',
  '@faasjs/eslint-config-vue',
  'faasjs',
  '@faasjs/func',
  '@faasjs/graphql-server',
  '@faasjs/http',
  '@faasjs/load',
  '@faasjs/logger',
  '@faasjs/nuxt',
  '@faasjs/redis',
  '@faasjs/request',
  '@faasjs/server',
  '@faasjs/sql',
  '@faasjs/tencentcloud',
  '@faasjs/test',
  '@faasjs/vue-plugin'
];

const NODE_PACKAGES = [
  'async_hooks',
  'child_process',
  'cluster',
  'crypto',
  'dns',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'inspector',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'tls',
  'trace_events',
  'tty',
  'dgram',
  'udp4',
  'url',
  'util',
  'v8',
  'vm',
  'wasi',
  'worker_threads',
  'zlib'
];

/**
 * 加载 ts 文件
 *
 * @param filename {string} 完整源文件路径
 * @param options {object} 配置项
 * @param options.input {object} 读取配置
 * @param options.output {object} 写入配置
 * @param options.tmp {boolean} 是否为临时文件，true 则生成的文件会被删除，默认为 false
 */
export default async function loadTs (filename: string, options: {
  input?: {
    [key: string]: any;
  };
  output?: {
    [key: string]: any;
  };
  tmp?: boolean;
} = Object.create(null)): Promise<{
    module: Func;
    dependencies: {
      [key: string]: string;
    };
  }> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const PackageJSON = require(`${process.cwd()}/package.json`);
  const external = PackageJSON['dependencies'] ? FAAS_PACKAGES.concat(Object.keys(PackageJSON.dependencies)) : FAAS_PACKAGES;

  const input = deepMerge({
    input: filename,
    external,
    plugins: [
      typescript({ tsconfigOverride: { compilerOptions: { declaration: false } } })
    ],
    onwarn: () => null
  }, options.input || {});

  const bundle = await rollup.rollup(input);

  const dependencies = Object.create(null);

  for (const m of bundle.cache.modules || [])
    for (const d of m.dependencies)
      if (!d.startsWith('/') && !dependencies[d] && !NODE_PACKAGES.includes(d)) dependencies[d] = '*';

  const output = deepMerge({
    file: filename + '.tmp.js',
    format: 'cjs'
  }, options.output || {});

  await bundle.write(output);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const module = require(output.file);

  if (options.tmp) unlinkSync(output.file);

  return {
    module,
    dependencies
  };
}
