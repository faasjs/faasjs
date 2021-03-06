/* eslint-disable @typescript-eslint/no-var-requires */
import { Command } from 'commander'
import Logger from '@faasjs/logger'
import { existsSync } from 'fs'
import { sep } from 'path'
import { NewCommand } from './commands/new'
import { DeployCommand } from './commands/deploy'
import { ServerCommand } from './commands/server'

const commander = new Command()
const logger = new Logger('Cli')

// 设置命令
commander
  .version('beta')
  .usage('[command] [flags]')
  .option('-v --verbose', '显示调试日志')
  .option('-r --root <path>', '项目根目录，默认为命令执行时所在的目录')
  .option('-e --env <staging>', '环境，默认为 development', 'development')

  .on('option:verbose', function () {
    process.env.verbose = '1'
    process.env.FaasLog = 'debug'
    logger.debug('已启用调试信息展示')
  })
  .on('option:root', function (root?: string) {
    if (root && existsSync(root)) {
      process.env.FaasRoot = root
      if (!root.endsWith(sep)) process.env.FaasRoot += sep
    } else throw Error(`Can't find root path: ${root}`)

    logger.debug('root: %s', process.env.FaasRoot)
  })
  .on('option:env', function (env?: string) {
    if (env) process.env.FaasEnv = env

    logger.debug('env: %s', process.env.FaasEnv)
  })
  .on('command:*', function (cmd: string) {
    logger.error(`Unknown command: ${cmd}`)
  })

// 加载命令
NewCommand(commander)
DeployCommand(commander)
ServerCommand(commander)

// eslint-disable-next-line no-unexpected-multiline
async function main () {
  try {
    if (!process.env.CI && process.argv[0] !== 'fake') await commander.parseAsync(process.argv)
  } catch (error) {
    process.exit(1)
  }
}

export default main()
