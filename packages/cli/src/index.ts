/* eslint-disable @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */

import { Command } from 'commander';
import Logger from '@faasjs/logger';
import { existsSync } from 'fs';
import { sep, join } from 'path';
import New from './commands/new';
import Deploy from './commands/deploy';
import Server from './commands/server';

const tsconfig = require(join(process.cwd(), 'tsconfig.json'));

if (tsconfig.compilerOptions?.baseUrl && tsconfig.compilerOptions?.paths)
  require('tsconfig-paths').register({
    baseUrl: tsconfig.compilerOptions.baseUrl || '.',
    paths: tsconfig.compilerOptions.paths || {}
  });

require('ts-node').register({
  project: join(process.cwd(), 'tsconfig.json'),
  compilerOptions: { module: 'commonjs' }
});

const commander = new Command();
const logger = new Logger('Cli');

// 设置命令
commander
  .version('beta')
  .usage('[command] [flags]')
  .option('-v --verbose', '显示调试日志')
  .option('-r --root <path>', '项目根目录，默认为命令执行时所在的目录')
  .option('-e --env <staging>', '环境，默认为 development', 'development')

  .on('option:verbose', function () {
    process.env.verbose = '1';
    process.env.FaasLog = 'debug';
    logger.debug('已启用调试信息展示');
  })
  .on('option:root', function (this: { root?: string }) {
    if (this.root && existsSync(this.root)) {
      process.env.FaasRoot = this.root;
      if (!this.root.endsWith(sep)) process.env.FaasRoot += sep;
    } else
      throw Error(`Can't find root path: ${this.root}`);

    logger.debug('root: %s', process.env.FaasRoot);
  })
  .on('option:env', function (this: { env?: string }) {
    if (this.env) process.env.FaasEnv = this.env;

    logger.debug('env: %s', process.env.FaasEnv);
  })
  .on('command:*', function (cmd: string) {
    logger.error(`Unknown command: ${cmd}`);
  });

// 加载命令
New(commander as Command);
Deploy(commander as Command);
Server(commander as Command);

if (!process.env.CI && process.argv[0] !== 'fake') commander.parse(process.argv);

export default commander;
