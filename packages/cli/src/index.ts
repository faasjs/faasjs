#!/usr/bin/env node

import { Command } from 'commander'
import { Logger } from '@faasjs/logger'
import { existsSync } from 'fs'
import { sep } from 'path'
import { NewCommand } from './commands/new'
import { DeployCommand } from './commands/deploy'
import { ServerCommand } from './commands/server'

const commander = new Command()
const logger = new Logger('Cli')

commander
  .version('beta')
  .usage('[command] [flags]')
  .option('-v --verbose', 'Show verbose logs')
  .option('-r --root <path>', 'Root path')
  .option('-e --env <staging>', 'Environment', 'development')

  .on('option:verbose', () => {
    process.env.verbose = '1'
    process.env.FaasLog = 'debug'
    logger.debug('Verbose log enabled.')
  })
  .on('option:root', (root?: string) => {
    if (root && existsSync(root)) {
      process.env.FaasRoot = root
      if (!root.endsWith(sep)) process.env.FaasRoot += sep
    } else throw Error(`Can't find root path: ${root}`)

    logger.debug('root: %s', process.env.FaasRoot)
  })
  .on('option:env', (env?: string) => {
    if (env) process.env.FaasEnv = env

    logger.debug('env: %s', process.env.FaasEnv)
  })

// load commands
NewCommand(commander)
DeployCommand(commander)
ServerCommand(commander)

async function main() {
  try {
    if (!process.env.CI && process.argv[0] !== 'fake')
      return await commander.parseAsync(process.argv)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default main()
