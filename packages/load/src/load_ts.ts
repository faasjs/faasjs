import deepMerge from '@faasjs/deep_merge';
import { unlinkSync } from 'fs';
import * as rollup from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { Func } from '@faasjs/func';

const EXTERNAL = [
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
  const external = PackageJSON['dependencies'] ? EXTERNAL.concat(Object.keys(PackageJSON.dependencies)) : EXTERNAL;

  const input = deepMerge({
    input: filename,
    external,
    plugins: [
      typescript({
        rollupCommonJSResolveHack: true,
        tsconfigOverride: { compilerOptions: { declaration: false } }
      }),
      commonjs({ include: 'node_modules/**' }),
      nodeResolve(),
    ],
    onwarn: () => null
  }, options.input || {});

  const bundle = await rollup.rollup(input);

  const dependencies = Object.create(null);

  for (const m of bundle.cache.modules || [])
    for (const d of m.dependencies)
      if (!d.startsWith('/') && !dependencies[d] && !EXTERNAL.includes(d)) dependencies[d] = '*';

  const output = deepMerge({
    file: filename + '.tmp.js',
    format: 'cjs',
    manualChunks (id: string) {
      if (id.includes('node_modules'))
        return 'vendor';
    }
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
